import '../styles/globals.css'

export const metadata = {
  title: 'MEL Category Calculator',
  description: 'Live calculation of MEL category repair deadlines',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}