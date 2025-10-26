import { LoginFormProps } from '../types/types';

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
}: LoginFormProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Login</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-80 bg-gray-50 p-6 rounded-xl shadow-md"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          disabled={isLoading}
          className="border border-gray-300 px-3 py-2 rounded-lg disabled:opacity-50"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          disabled={isLoading}
          className="border border-gray-300 px-3 py-2 rounded-lg disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && (
        <p className="mt-4 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
}