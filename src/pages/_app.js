import "@/styles/globals.css";
import "@/styles/app.css";
import MobileMessage from "@/components/MobileMessage/MobileMessage";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { CookiesProvider } from "react-cookie";

export default function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<CookiesProvider>
				<MobileMessage/>
				<Component {...pageProps} />
			</CookiesProvider>
		</UserProvider>
	);
}
