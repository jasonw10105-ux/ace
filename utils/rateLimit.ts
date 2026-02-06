
interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map()
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 15 * 60 * 1000) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.attempts.get(identifier)

    if (!entry || now > entry.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs })
      return true
    }

    if (entry.count >= this.maxAttempts) return false

    entry.count++
    return true
  }

  getRemainingAttempts(identifier: string): number {
    const entry = this.attempts.get(identifier)
    if (!entry || Date.now() > entry.resetTime) return this.maxAttempts
    return Math.max(0, this.maxAttempts - entry.count)
  }

  getResetTime(identifier: string): number | null {
    const entry = this.attempts.get(identifier)
    return entry && Date.now() <= entry.resetTime ? entry.resetTime : null
  }
}

export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000)
export const magicLinkRateLimiter = new RateLimiter(3, 60 * 60 * 1000)
