import { serialize } from "cookie";

export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    serialize("authToken", "", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: -1, // delete cookie
      secure: process.env.NODE_ENV === "production",
    })
  );

  res.status(200).json({ message: "Logged out" });
}
