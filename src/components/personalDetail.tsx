import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { VscChevronDown } from "react-icons/vsc";
import { useSession } from "next-auth/react";

type Props = {
  isShowing: any;
  setIsShowing: any;
};

const PersonalDetail = ({ isShowing, setIsShowing }: Props) => {
  const { data: session } = useSession();
  return (
    <>
      <Transition.Root show={isShowing} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-50"
          onClose={() => setIsShowing(false)}
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
                    <div className="h-full flex-col overflow-y-scroll bg-white  shadow-xl">
                      <div>
                        <div className="flex items-center justify-between pl-5 pr-4 mb-2 h-16 shadow-lg shadow-gray-200/30 rounded-3xl">
                          <div className="h-8 tracking-tighter text-2xl">
                            personal details
                          </div>
                          <div
                            onClick={() => setIsShowing(false)}
                            className="rounded-full cursor-pointer mr-2"
                          >
                            <VscChevronDown
                              size="20"
                              style={{ color: "#535353" }}
                            />
                          </div>
                        </div>
                        <div className="mx-4 mt-4">
                          <div className="my-3">
                            <label
                              htmlFor="name"
                              className="text-sm text-gray-700"
                            >
                              full name
                            </label>
                            <input
                              id="name"
                              type={"text"}
                              className="bg-gray-100 w-full text-gray-400 h-12 pl-3 border"
                              value={session?.user?.name || ""}
                              disabled={true}
                            />
                          </div>

                          <div className="my-3">
                            <label
                              htmlFor="email"
                              className="text-sm text-gray-700"
                            >
                              email
                            </label>
                            <input
                              id="email"
                              type={"text"}
                              className="bg-gray-100 w-full text-gray-400 h-12 pl-3 border"
                              value={session?.user?.email || ""}
                              disabled={true}
                            />
                          </div>
                          <button
                            className="w-full bg-gray-500 rounded-full h-14 text-white mt-6"
                            disabled={true}
                          >
                            save
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
    </>
  );
};

export default PersonalDetail;
