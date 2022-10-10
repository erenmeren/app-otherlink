import { ReactElement } from "react";

import Layout from "@/components/layout";
import homePgeImage from "@/assets/img/home-page-image.png";
import SignInExplain from "@/components/signInExplain";
import { useSession } from "next-auth/react";

export default function IndexPage() {
  const { status } = useSession();

  return (
    <>
      <div className="rounded-3xl bg-[#fff5fe] shadow-md shadow-gray-200/60">
        <div className="overflow-hidden ">
          <img
            src={homePgeImage.src}
            alt="main_page_image"
            className="rounded-t-3xl w-full"
          />
        </div>
        <div className="py-5 px-4">
          <p className="pb-2 font-medium text-2xl tracking-tight">
            welcome to otherlink !
          </p>
          <p className="text-[#4c4c4c] tracking-tight text-lg font-medium">
            the fastest way to get receipts
          </p>
          <p className="text-[#4c4c4c] tracking-tight text-lg font-medium underline underline-offset-1 -mt-2">
            <a href="https://otherlink.io">learn more</a>
          </p>
        </div>
      </div>
      {/* sign in */}
      {status !== "authenticated" && (
        <SignInExplain showBorder={true} offers={[]} />
      )}
    </>
  );
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
