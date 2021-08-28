// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// Not going to use this
// Only executes in server, APIs that are not included in the client side app

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
