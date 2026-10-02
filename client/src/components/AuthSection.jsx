function AuthSection({
  user,
  email,
  setEmail,
  password,
  setPassword,
  handleAuth,
  handleLogout,
}) {
  return user ? (
    <div className="auth-section">
      <p>Logged in as {user.email}</p>
      <button className="secondary-button" type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  ) : (
    <div className="auth-section">
      <h2>Save your decisions</h2>
      <p>Register or log in to save comparisons and return to them later.</p>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 8 characters"
        autoComplete="current-password"
      />
      <div className="auth-actions">
        <button type="button" onClick={() => handleAuth("register")}>
          Register
        </button>

        <button type="button" onClick={() => handleAuth("login")}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AuthSection;
