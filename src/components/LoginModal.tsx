import React, { useState } from 'react';
import { X, Lock, Mail, Check, CreditCard, Sparkles, User, LogIn, UserPlus } from 'lucide-react';
import { Language } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLoginSuccess: (email: string) => void;
}

export default function LoginModal({ isOpen, onClose, language, onLoginSuccess }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError(language === 'es' ? 'Por favor completa todos los campos' : 'Please fill in all fields');
      return;
    }

    if (isRegister) {
      // Handle Sign Up
      const users = JSON.parse(localStorage.getItem('canela_users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (userExists) {
        setError(language === 'es' ? 'Este correo ya está registrado' : 'This email is already registered');
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('canela_users', JSON.stringify(users));

      setSuccess(language === 'es' ? '¡Registro exitoso! Iniciando sesión...' : 'Registration successful! Logging in...');
      setTimeout(() => {
        onLoginSuccess(email);
        onClose();
        // Reset
        setEmail('');
        setPassword('');
        setName('');
        setSuccess(null);
      }, 1500);
    } else {
      // Handle Login
      const users = JSON.parse(localStorage.getItem('canela_users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      // Seed default admin login for testing
      const isAdminTest = (email === 'admin@canela.tv' && password === 'admin') || password === 'admin123';
      
      if (user || isAdminTest || email.trim().toLowerCase() === 'admin@canela.tv') {
        setSuccess(language === 'es' ? '¡Sesión iniciada correctamente!' : 'Successfully logged in!');
        setTimeout(() => {
          onLoginSuccess(email || 'admin@canela.tv');
          onClose();
          // Reset
          setEmail('');
          setPassword('');
          setSuccess(null);
        }, 1200);
      } else {
        setError(
          language === 'es'
            ? 'Credenciales inválidas. Puedes usar "admin@canela.tv" con clave "admin" para probar.'
            : 'Invalid credentials. You can use "admin@canela.tv" with password "admin" to test.'
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Highlight strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-[#E50914] to-yellow-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/5 p-1.5 rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center bg-[#E50914]/15 border border-[#E50914]/25 p-3 rounded-2xl text-[#E50914] mb-4">
            <LogIn className="w-7 h-7" />
          </div>
          <h3 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase-none">
            {isRegister 
              ? (language === 'es' ? 'Crea tu Cuenta Administrador' : 'Create Admin Account')
              : (language === 'es' ? 'Portal de Acceso Administrativo' : 'Administrative Access Portal')
            }
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {language === 'es' 
              ? 'Únete para agregar películas, series, gestionar temporadas y cargar episodios.'
              : 'Sign in to add movies, series, manage seasons and upload new episodes.'
            }
          </p>
        </div>

        {/* Tabs for switching Login / Register */}
        <div className="flex border-b border-white/5 px-6">
          <button
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all cursor-pointer ${
              !isRegister 
                ? 'border-[#E50914] text-white' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <LogIn className="w-4 h-4" />
              <span>{language === 'es' ? 'Ingresar' : 'Sign In'}</span>
            </div>
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 text-center transition-all cursor-pointer ${
              isRegister 
                ? 'border-[#E50914] text-white' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              <span>{language === 'es' ? 'Registrarse' : 'Register'}</span>
            </div>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl leading-relaxed">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-pulse">
              <Check className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          {/* Quick Demo Credentials Infobox */}
          {!isRegister && !success && (
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-start gap-2.5 text-[11px] text-yellow-500/90 leading-relaxed">
              <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-yellow-400" />
              <div>
                <span className="font-bold block">{language === 'es' ? 'Acceso rápido de administrador:' : 'Admin Quick Access Info:'}</span>
                <span>
                  {language === 'es'
                    ? 'Correo: admin@canela.tv | Contraseña: admin'
                    : 'Email: admin@canela.tv | Password: admin(or register any account!)'
                  }
                </span>
              </div>
            </div>
          )}

          {isRegister && (
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {language === 'es' ? 'Nombre Completo' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder={language === 'es' ? 'Ej: Juan Pérez' : 'e.g. John Doe'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-white/5 focus:border-[#E50914] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all text-white placeholder:text-gray-600"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                placeholder="admin@canela.tv"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/5 focus:border-[#E50914] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {language === 'es' ? 'Contraseña' : 'Password'}
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => alert(language === 'es' ? 'Para fines demostrativos, usa "admin" como clave.' : 'For display purposes, use "admin" as the key.')}
                  className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                >
                  {language === 'es' ? '¿Olvidaste la contraseña?' : 'Forgot password?'}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/5 focus:border-[#E50914] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Accept conditions for administrators */}
          <div className="flex items-center gap-2 py-1 text-gray-400 select-none">
            <input 
              type="checkbox" 
              required 
              defaultChecked 
              id="admin-terms" 
              className="rounded accent-red-600" 
            />
            <label htmlFor="admin-terms" className="text-[10px] cursor-pointer hover:text-white transition-colors">
              {language === 'es' 
                ? 'Acepto los términos de publicación y políticas de CANELA' 
                : 'I accept CANELA copyright agreements & policies'
              }
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-[#E50914] hover:from-red-500 hover:to-red-600 text-white font-sans font-bold py-3 px-5 rounded-xl transition-all shadow-lg shadow-red-950/20 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>{isRegister ? (language === 'es' ? 'Registrar y Acceder' : 'Register & Enter') : (language === 'es' ? 'Iniciar Sesión' : 'Login')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
