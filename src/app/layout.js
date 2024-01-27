import { Inter } from "next/font/google";
import "./globals.css";
import MyMain from "@components/MyMain";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskPro | Manage Your Tasks Efficently",
  description: "A task manager web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MyMain>{children}</MyMain>
      </body>
    </html>
  );
}
