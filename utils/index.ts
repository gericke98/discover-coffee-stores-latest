export const getDomain = () => {
  return new URL(
    process.env.NODE_ENV === "production"
      ? "https://discover-coffee-stores-latest.vercel.app"
      : "https://localhost:3000"
  );
};
