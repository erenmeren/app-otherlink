import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import Receipt from "./receiptList";
import ManageAccount from "./manageAccount";
import PersonalDetail from "./personalDetail";
import Loyalty from "./loyalty";

import { Dialog, Transition } from "@headlessui/react";

import { GrClose } from "react-icons/gr";
import { FaUserCircle } from "react-icons/fa";
import { AiFillGift } from "react-icons/ai";
import { IoReceiptSharp } from "react-icons/io5";
import { BsQuestionOctagonFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";

import logo from "@/assets/img/logo-horizontal.svg";

import { addUserInfo, deleteUserInfo } from "@/features/user/slice";
import { useAppDispatch } from "@/app/hooks";
// import { useRouter } from "next/router";
// import { setCookie } from "cookies-next";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  // const { asPath } = useRouter();
  const dispatch = useAppDispatch();

  const [isSigninShowing, setIsSigninShowing] = useState(false);
  const [isMenuShowing, setIsMenuShowing] = useState(false);
  const [isReceiptShowing, setIsReceiptShowing] = useState(false);
  const [isPersonalDetailShowing, setIsPersonalDetailShowing] = useState(false);
  const [isLoyaltyShowing, setIsLoyaltyShowing] = useState(false);
  const [isManageAccountShowing, setIsManageAccountShowing] = useState(false);

  // const callbackUrl = process.env.NEXT_PUBLIC_SIGNIN_CALLBACK_URL as string;

  // const callback = callbackUrl + asPath;

  // useEffect(() => {
  //   setCookie("next-auth.callback-url", callback);
  // }, [asPath]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          dispatch(addUserInfo(data.item));
        });
    } else {
      dispatch(deleteUserInfo());
    }
  }, [status]);

  return (
    <>
      <div className="flex justify-center">
        <div className="relative bg-white h-screen w-[31.3rem] ">
          {/* nav */}
          <div className="flex items-center justify-between pl-5 pr-4 mb-2 h-16 shadow-lg shadow-gray-200/30 rounded-3xl">
            <div className="h-8 pt-2">
              <Image
                src={logo}
                height={20}
                width={170}
                loading="lazy"
                alt="company-logo"
              />
            </div>
            <div>
              {session ? (
                <div
                  onClick={() =>
                    setIsMenuShowing((isMenuShowing) => !isMenuShowing)
                  }
                >
                  {session?.user?.image ? (
                    <img
                      alt="avatar"
                      src={session?.user?.image || ""}
                      width={38}
                      height={38}
                      className="rounded-full cursor-pointer"
                    />
                  ) : (
                    <HiOutlineUser size={30} className="cursor-pointer" />
                  )}
                </div>
              ) : (
                <div
                  onClick={() => setIsSigninShowing(true)}
                  className="flex items-center h-[2.5rem] rounded-3xl border  border-gray-200 px-4 cursor-pointer"
                >
                  <div className="mr-2 ">
                    <FaUserCircle size="20" style={{ color: "#b2b2b2" }} />
                  </div>
                  <div className=" font-medium text-sm">log in</div>
                </div>
              )}
            </div>
          </div>
          <div className="mx-2 ">{children}</div>
        </div>
      </div>
      {session && (
        <>
          {/* menu */}
          <Transition.Root show={isMenuShowing} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 overflow-hidden z-30"
              onClose={() => setIsMenuShowing(false)}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-700"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-700"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="absolute inset-0 bg-gray-900 bg-opacity-80 transition-opacity" />
                </Transition.Child>
                <div className="flex justify-center">
                  <div className="pointer-events-none fixed inset-y-0 flex max-w-full w-[31.3rem] ">
                    <Transition.Child
                      as={Fragment}
                      enter="transform transition ease-in-out duration-200"
                      enterFrom="translate-y-full"
                      enterTo="translate-y-0"
                      leave="transform transition ease-in-out duration-200"
                      leaveFrom="translate-y-0"
                      leaveTo="translate-y-full"
                    >
                      <div className="pointer-events-auto relative w-full">
                        <div className="h-full flex-col overflow-y-scroll bg-white shadow-xl">
                          <div>
                            {/* nav */}
                            <div className="flex items-center justify-between pl-5 pr-4 mb-2 h-16 shadow-lg shadow-gray-200/30 rounded-3xl">
                              <div className="h-8 pt-2">
                                <Image
                                  src={logo}
                                  height={20}
                                  width={170}
                                  loading="lazy"
                                  alt="company-logo"
                                />
                              </div>
                              <div
                                onClick={() => setIsMenuShowing(false)}
                                className="rounded-full cursor-pointer mr-2"
                              >
                                <GrClose
                                  size="20"
                                  style={{ color: "#535353" }}
                                />
                              </div>
                            </div>
                            {/* body */}
                            <div className="p-6">
                              <div className="flex flex-col">
                                <div className="flex justify-center">
                                  {session?.user?.image ? (
                                    <img
                                      alt="avatar"
                                      src={session?.user?.image || ""}
                                      width={150}
                                      height={150}
                                      className="rounded-full"
                                    />
                                  ) : (
                                    <HiOutlineUser size={150} />
                                  )}
                                </div>
                                <div className="flex justify-center mt-4 text-xl tracking-tight capitalize">
                                  {session.user?.name}
                                </div>
                                <div className="flex justify-center mt-2 text-sm text-gray-400 tracking-tighter">
                                  {session.user?.email}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-8 ">
                                <MenuButtons
                                  icon={<FaUserCircle size="20" />}
                                  text="personal details"
                                  showPage={setIsPersonalDetailShowing}
                                />
                                <MenuButtons
                                  icon={<AiFillGift size="22" />}
                                  text="loyalty"
                                  showPage={setIsLoyaltyShowing}
                                />
                                <MenuButtons
                                  icon={<IoReceiptSharp size="20" />}
                                  text="receipts"
                                  showPage={setIsReceiptShowing}
                                />
                                <MenuButtons
                                  icon={<BsQuestionOctagonFill size="20" />}
                                  text="manage account"
                                  showPage={setIsManageAccountShowing}
                                />
                              </div>
                              <button
                                onClick={() => {
                                  signOut();
                                }}
                                className="bg-white border outline-none font-medium tracking-tight w-full h-16 rounded-full mt-7"
                              >
                                log out
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* receipt list page */}
          <Receipt
            isShowing={isReceiptShowing}
            setIsShowing={setIsReceiptShowing}
          />

          {/* manage account page */}
          <ManageAccount
            isShowing={isManageAccountShowing}
            setIsShowing={setIsManageAccountShowing}
          />

          {/* personal detail page */}
          <PersonalDetail
            isShowing={isPersonalDetailShowing}
            setIsShowing={setIsPersonalDetailShowing}
          />

          {/* loyalty page */}
          <Loyalty
            isShowing={isLoyaltyShowing}
            setIsShowing={setIsLoyaltyShowing}
          />
        </>
      )}
      {/* sign in */}
      <Transition.Root show={isSigninShowing} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-30"
          onClose={() => setIsSigninShowing(false)}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-700"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-900 bg-opacity-80 transition-opacity" />
            </Transition.Child>
            <div className="flex justify-center">
              <div className="pointer-events-none fixed inset-y-0 flex max-w-full w-[31.3rem] ">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-200"
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0"
                  leave="transform transition ease-in-out duration-200"
                  leaveFrom="translate-y-0"
                  leaveTo="translate-y-full"
                >
                  <div className="pointer-events-auto relative w-full">
                    <div className="h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div>
                        {/* nav */}
                        <div className="flex items-center justify-between pl-5 pr-4 mb-2 h-16 shadow-lg shadow-gray-200/30 rounded-3xl">
                          <div className="h-8 pt-2">
                            <Image
                              src={logo}
                              height={20}
                              width={170}
                              loading="lazy"
                              alt="company-logo"
                            />
                          </div>
                          <div
                            onClick={() => setIsSigninShowing(false)}
                            className="rounded-full cursor-pointer mr-2"
                          >
                            <GrClose size="20" style={{ color: "#535353" }} />
                          </div>
                        </div>
                        {/* body */}
                        <div className="p-6">
                          <div className="p-16">
                            <div className="text-3xl font-semibold ">login</div>
                            <div className="pt-6">
                              <button
                                aria-label="Continue with google"
                                role="button"
                                className="outline-none py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10"
                                onClick={() => signIn("google")}
                              >
                                <svg
                                  width={19}
                                  height={20}
                                  viewBox="0 0 19 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z"
                                    fill="#4285F4"
                                  />
                                  <path
                                    d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z"
                                    fill="#34A853"
                                  />
                                  <path
                                    d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z"
                                    fill="#FBBC05"
                                  />
                                  <path
                                    d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z"
                                    fill="#EB4335"
                                  />
                                </svg>
                                <p className="text-base font-medium ml-4 text-gray-700">
                                  Continue with Google
                                </p>
                              </button>
                            </div>
                            <div className="pt-6">
                              <button
                                aria-label="Continue with google"
                                role="button"
                                className="outline-none  py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10"
                                onClick={() => signIn("apple")}
                              >
                                <svg
                                  width={25}
                                  height={25}
                                  viewBox="0 0 170 170"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375a25.222 25.222 0 0 1-.188-3.07c0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71.12 1.083.17 2.166.17 3.24z" />
                                </svg>
                                <p className="text-base font-medium ml-4 text-gray-700">
                                  Continue with Apple
                                </p>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const MenuButtons = ({ icon, text, showPage }: any) => (
  <div
    className="border h-24 border-black cursor-pointer"
    onClick={() => showPage(true)}
  >
    <div className="flex flex-col">
      <div className="flex justify-center mt-5">{icon}</div>
      <div className="flex justify-center mt-4 tracking-tight">{text}</div>
    </div>
  </div>
);

export default Layout;
