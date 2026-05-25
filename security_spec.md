# Security Specification for CANELA.TV Firebase

This specification outlines the data invariants and access controls governing users, videos, and reviews.

## 1. Data Invariants

- **Users**: A user document at `/users/{userId}` can only be created, read, or updated if the user is authenticated and `request.auth.uid == userId`. Users cannot elevate their own role or spoof another user.
- **Videos**: Videos can only be managed (created, modified, or deleted) if the active user is a verified administrator. Read operations are public to all signed-in or signed-out viewers.
- **UserReviews**: A review is written to `/reviews/{reviewId}`. It must contain the reviewer's authenticated user details (validated by the server rules), a score between 1 and 5, and must belong to an existing video (checked relationally if required). Non-owners are forbidden from modifying or deleting another user's review.

## 2. The "Dirty Dozen" Payloads (Denial-by-Default Testing)

We verify that the following standard exploits fail:

1. **Self-Assigned Points (Elevated Admin Rights)**: Trying to write `isAdmin: true` without auth.
2. **Review Hijacking**: Modifying another user's review fields.
3. **Invalid Movie Structure**: Injecting a custom movie with no title or illegal categories.
4. **Huge String Overloads**: Sending a 1.2MB review comment to exhaust cloud resources.
5. **No-Auth Profile Writing**: Creating a user record in `/users/some_random_uid` as an anonymous or distinct user.
6. **Negative Ratings**: Rating a video `0` or `-5` stars in `reviews`.
7. **Invalid Movie Categories**: Publishing a movie with category `hacked`.
8. **Rating Overlimits**: Rating a video `10` or a very large number.
9. **Tampering with immutables**: Modifying `createdAt` during an update.
10. **Orphaned Reviews**: Posting reviews for non-existent video IDs (under normal schema flow).
11. **Spoofed User UIDs**: Creating a review where `user_email` is spoofed to represent an administrator under a distinct login context.
12. **Malicious ID Injection**: Creating a video with an ID containing malicious symbols to perform script injections or wallet denial.

## 3. Security Rule Blueprint

The Security Rules must perform:
- Exact key sizing constraints.
- Validation of datatypes.
- Re-validation on every write.
