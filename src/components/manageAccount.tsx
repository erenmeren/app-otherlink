import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { VscChevronDown } from "react-icons/vsc";

type Props = {
  isShowing: any;
  setIsShowing: any;
};

const ManageAccount = ({ isShowing, setIsShowing }: Props) => {
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
                          <div className="h-8 pt-2 text-2xl">
                            manage account
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
                        <div className="m-10">
                          <a
                            href="mailto:info@otherlink.io"
                            className="outline-none"
                          >
                            <button className="w-full bg-black rounded-full h-12  text-white outline-none">
                              contact customer support
                            </button>
                          </a>
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

export default ManageAccount;
