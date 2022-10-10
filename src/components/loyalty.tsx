import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { VscChevronDown } from "react-icons/vsc";

import ClaimPage from "@/components/claim";
import LoyaltyBox from "@/components/loyaltyBox";
import { ILoyalty, IOffer } from "@/interfaces/loyalty";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateLoyalty, UserInfoState } from "@/features/user/slice";
import { updateSiteLoyalty } from "@/features/loyalty/slice";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

type Props = {
  isShowing: any;
  setIsShowing: any;
};

interface GlobalState {
  user?: UserInfoState;
}

const Loyalty = ({ isShowing, setIsShowing }: Props) => {
  const { data: session } = useSession();

  const [offer, setOffer] = useState<IOffer>();
  const [loyalty, setLoyalty] = useState<ILoyalty>();
  const [downCounter, setDownCounter] = useState<number>(0);
  const [isClaimPageShowing, setIsClaimPageShowing] = useState(false);

  const { user } = useAppSelector<GlobalState>((state) => state);
  const dispatch = useAppDispatch();

  const userLoyalties = user?.item?.loyalties || [];

  const claimOffer = async (loyalty: ILoyalty, offer: IOffer) => {
    if (offer.numberOfVisit > loyalty.numberOfVisit) return;

    const cookieName = "claimTime" + offer.id;
    const claimTime = getCookie(cookieName) as string;

    if (claimTime === undefined) {
      await fetch("/api/loyalty", {
        method: "POST",
        body: JSON.stringify({ siteId: loyalty.siteId, offerId: offer.id }),
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(updateSiteLoyalty(data));
          dispatch(updateLoyalty(data));

          setOffer(offer);
          setLoyalty(loyalty);

          const downTime = Date.now() + 299000;
          setDownCounter(downTime);
          setCookie(cookieName, downTime, {
            maxAge: 60 * 5,
          });
          setIsClaimPageShowing(true);
        });
    } else {
      setIsClaimPageShowing(true);
      setOffer(offer);
      setDownCounter(parseInt(claimTime));
    }
  };

  const closeOffer = (offerId: string) => {
    const cookieName = "claimTime" + offerId;

    // TODO : call end potin end remove visit counts
    toast.success(
      `Hello ${session?.user?.name}, you have rewarded one ${offer?.name}. Thank you for being part of our tree saving program.`,
      {
        position: "top-center",
        autoClose: 7654,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );

    setOffer(undefined);
    deleteCookie(cookieName);
    setIsClaimPageShowing(false);
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
                    <div className="h-full flex-col overflow-y-scroll bg-white  shadow-xl">
                      <div>
                        <div className="flex items-center justify-between pl-5 pr-4 mb-2 h-16 shadow-lg shadow-gray-200/30 rounded-3xl">
                          <div className="h-8 pt-2 text-2xl">loyalty</div>
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
                        <div className="p-5">
                          <div className="my-2">
                            {userLoyalties.map((loyalty, index) => {
                              return (
                                <LoyaltyBox
                                  key={`siteLoyalty_${index}`}
                                  loyalty={loyalty}
                                  claimOffer={claimOffer}
                                />
                              );
                            })}
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
      <ClaimPage
        isShowing={isClaimPageShowing}
        setIsShowing={setIsClaimPageShowing}
        downCounter={downCounter}
        offerId={offer?.id || ""}
        closeOffer={closeOffer}
        siteName={loyalty?.siteName}
      />
    </>
  );
};

export default Loyalty;
