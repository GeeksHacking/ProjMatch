import "@/styles/globals.css";
import SideNav from "@/components/SideNav/SideNav";
import "@/styles/app.css";
import MobileMessage from "@/components/MobileMessage/MobileMessage";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { CookiesProvider } from "react-cookie";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<CookiesProvider>
				<div className="relative flex h-full w-full flex-row">
					<div className="fixed z-20 h-screen">
						<SideNav />
					</div>
					<Component {...pageProps} />
				</div>
				<MobileMessage/>
			</CookiesProvider>
		</UserProvider>
	);
}
