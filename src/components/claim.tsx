import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Countdown, { zeroPad } from "react-countdown";

type Props = {
  isShowing: any;
  setIsShowing: any;
  downCounter: number;
  offerId: string;
  closeOffer: any;
  siteName: any;
};

const Claim = ({
  isShowing,
  setIsShowing,
  downCounter,
  closeOffer,
  offerId,
  siteName,
}: Props) => {
  // const Completionist = () => closeOffer();

  const renderer = ({ minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      closeOffer(offerId);
      return <></>;
    } else {
      // Render a countdown
      return (
        <span className="text-9xl text-blue-600">
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };

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
                    <div className="h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="text-center">
                        <div className="text-4xl font-semibold mt-16 text-gray-600">
                          {siteName}
                        </div>
                        <div className="mt-36">
                          <Countdown date={downCounter} renderer={renderer} />
                        </div>
                        <div className="text-7xl mt-10">Free Coffee</div>
                      </div>
                      <div className="mx-5 absolute bottom-5 left-3 right-3">
                        <div
                          className="h-16 mt-4 pt-3 px-4 bg-black rounded-lg text-white text-3xl text-center"
                          onClick={() => closeOffer(offerId)}
                        >
                          close
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

export default Claim;
