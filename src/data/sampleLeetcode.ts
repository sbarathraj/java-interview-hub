// Single starter sample seeded into a NEW user's account on first visit.
// Scenario: "New Account Login" — a LeetCode-style design problem.
export interface SampleSolution {
  problem_number: number;
  title: string;
  leetcode_url: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  status: "solved" | "revisit" | "unsolved";
  date_solved: string;
  code: string;
  approach: string;
  time_complexity: string;
  space_complexity: string;
  notes: string;
}

export const SAMPLE_SOLUTIONS: SampleSolution[] = [
  {
    problem_number: 1001,
    title: "New Account Login",
    leetcode_url: "https://leetcode.com/problems/design-authentication-manager/",
    difficulty: "medium",
    category: "hashing",
    tags: ["HashMap", "Design", "Auth"],
    status: "solved",
    date_solved: new Date().toISOString().slice(0, 10),
    code: `import java.util.HashMap;
import java.util.Map;

/**
 * "New Account Login" — design a login service that:
 *  - registers a new account (email + password)
 *  - signs in an existing account
 *  - issues a session token valid for a TTL
 */
class LoginService {
    private final Map<String, String> accounts = new HashMap<>();   // email -> hashedPassword
    private final Map<String, Long>   sessions = new HashMap<>();   // token -> expiryEpochMs
    private final long ttlMillis;

    public LoginService(long ttlMillis) {
        this.ttlMillis = ttlMillis;
    }

    /** Returns true if the account was created, false if email already exists. */
    public boolean register(String email, String password) {
        if (accounts.containsKey(email)) return false;
        accounts.put(email, hash(password));
        return true;
    }

    /** Returns a session token on success, or null on failure. */
    public String login(String email, String password, long nowMs) {
        String stored = accounts.get(email);
        if (stored == null || !stored.equals(hash(password))) return null;
        String token = email + ":" + nowMs;
        sessions.put(token, nowMs + ttlMillis);
        return token;
    }

    public boolean isValid(String token, long nowMs) {
        Long exp = sessions.get(token);
        return exp != null && exp > nowMs;
    }

    private String hash(String s) {
        // Demo only — use BCrypt / Argon2 in production.
        return Integer.toHexString(s.hashCode());
    }
}`,
    approach:
      "Two HashMaps: one for credentials (email → hashed password) and one for active sessions (token → expiry). Register rejects duplicates; login verifies the hash and issues a TTL-bound token; isValid checks both presence and expiry.",
    time_complexity: "O(1) average per operation",
    space_complexity: "O(U + S) where U = users, S = active sessions",
    notes:
      "Edge cases: duplicate email on register, wrong password, expired token. In production swap the demo hash for BCrypt/Argon2 and back the maps with a real DB + Redis for sessions.",
  },
];
