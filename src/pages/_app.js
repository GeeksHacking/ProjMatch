import "@/styles/globals.css";
import "@/styles/app.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { CookiesProvider } from "react-cookie";

export default function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<CookiesProvider>
				<Component {...pageProps} />
			</CookiesProvider>
		</UserProvider>
	);
}
