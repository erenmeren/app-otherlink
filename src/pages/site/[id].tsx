import { Fragment, ReactElement, useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";

import Layout from "@/components/layout";
import LoyaltyCard from "@/components/loyaltyCard";
import ClaimPage from "@/components/claim";

import { BsArrowUpRight, BsChevronDown } from "react-icons/bs";
import { Disclosure, Tab } from "@headlessui/react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { wrapper } from "@/app/store";
import { getSiteAsync, SiteState } from "@/features/site/slice";
import { clearDocument, getDocumentAsync } from "@/features/document/slice";
import { addDocumentToUser } from "@/features/user/api";
import SignInExplain from "@/components/signInExplain";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { ILoyalty, ILoyaltyResponse, IOffer } from "@/interfaces/loyalty";
import { newVisitAsync, updateSiteLoyalty } from "@/features/loyalty/slice";
import { updateLoyalty } from "@/features/user/slice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { AiOutlineStar } from "react-icons/ai";
import { IDocumentResponse } from "@/interfaces/document";

const downloadUrl = process.env.NEXT_PUBLIC_DOCUMENT_DOWNLOAD_URL;

interface GlobalState {
  site?: SiteState;
  document?: IDocumentResponse;
  loyalty?: ILoyaltyResponse;
}

function IndexPage() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { document, site, loyalty } = useAppSelector<GlobalState>(
    (state) => state
  );

  const offers = site?.item?.offers?.filter((offer) => {
    return offer.status === "active";
  });

  // console.log({ site });
  // console.log({ offers });
  // console.log({ loyalty });

  const [offer, setOffer] = useState<IOffer>();
  const [isClaimPageShowing, setIsClaimPageShowing] = useState(false);
  const [downCounter, setDownCounter] = useState<number>(0);

  const downloadReceipt = (id: string) => {
    if (typeof window !== "undefined" && id !== "") {
      window.open(downloadUrl + "/" + id, "_blank");
    }
  };

  const openInstagramPage = (instagramName: string) => {
    if (typeof window !== "undefined" && instagramName !== "") {
      instagramName = "https://instagram.com/" + instagramName;
      window.open(instagramName, "_blank");
    }
  };

  const claimOffer = async (loyalty: ILoyalty, offer: IOffer) => {
    // if (!loyalty) return;
    // if (loyalty.item) return;
    if (loyalty.numberOfVisit < offer.numberOfVisit) return;

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

  useEffect(() => {
    if (
      status === "authenticated" &&
      router.query.d &&
      router.query.d.length === 44
    ) {
      if (loyalty?.message !== "") {
        toast.warn("Visit is already added!!!", {
          position: "top-center",
          autoClose: 4321,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Your visit has been added successfully.", {
          position: "top-center",
          autoClose: 4321,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }, [status]);

  return (
    <>
      <div className="rounded-3xl bg-[#fcfcfd] shadow-md shadow-gray-200 mb-2">
        <div className="h-[14.5rem] md:h-[17rem] flex justify-center ">
          <img
            className="inline object-cover w-40 h-40 rounded-full mt-10 md:mt-12"
            src="/jb.jpg"
            width={200}
            height={25}
            alt="site image"
          />
        </div>
        <div className="py-5 px-4 border-t border-grey-300 font-medium">
          {site?.item?.name}
        </div>
        {site?.item?.instagram && (
          <div
            className="py-5 mx-4 border-t border-grey-300 cursor-pointer font-medium flex justify-between"
            onClick={() => openInstagramPage(site.item?.instagram || "")}
          >
            @{site.item?.instagram}
            <BsArrowUpRight size="20" className="mr-2 mt-1" />
          </div>
        )}
      </div>

      {/* {document?.item && ( */}
      <div className="rounded-3xl shadow-md shadow-gray-200/60 pb-5 bg-gray-100 static">
        <Tab.Group>
          <Tab.List className="flex rounded-3xl bg-gray-500">
            {document?.item && (
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`
                               w-full rounded-t-3xl py-2.5 py-2.5 text-xl font-medium outline-none
                              ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400
                                ${
                                  selected
                                    ? "bg-gray-100 text-black"
                                    : "bg-gray-500 text-white"
                                }
                              `}
                  >
                    Receipt
                  </button>
                )}
              </Tab>
            )}
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`
                               w-full rounded-t-3xl py-2.5 text-xl font-medium outline-none
                              ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400
                                ${
                                  selected
                                    ? "bg-gray-100 text-black"
                                    : "bg-gray-500 text-white"
                                }
                              `}
                >
                  Loyalty
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {document?.item && (
              <Tab.Panel>
                {document.item?.receiptInfo &&
                  document.item?.receiptInfo.totalPrice !== undefined && (
                    <div className="w-full pt-5 px-4">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full justify-between text-base font-semibold text-gray-600 font-serif">
                              <span>
                                Total:{" "}
                                {document.item?.receiptInfo?.totalPrice !== "-"
                                  ? "£" + document.item?.receiptInfo?.totalPrice
                                  : document.item?.receiptInfo?.totalPrice}
                              </span>

                              <BsChevronDown
                                className={`${
                                  open ? "rotate-180 transform" : ""
                                } h-5 w-5`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pt-5 flex justify-center">
                              <div className="bg-white drop-shadow-2xl w-3/4 p-2">
                                <div className="text-center text-xl font-semibold">
                                  {site?.item?.name}
                                </div>
                                <div className="py-3 text-sm text-gray-600">
                                  {document.item?.receiptInfo?.dateArea?.map(
                                    (item, index) => {
                                      return (
                                        <p
                                          key={`dateArea${index}`}
                                          className="flex justify-center"
                                        >
                                          {item}
                                        </p>
                                      );
                                    }
                                  )}
                                </div>

                                <div id="items" className="border-t py-3 ">
                                  {document.item?.receiptInfo?.itemsArea?.map(
                                    (item, index) => {
                                      return (
                                        <div key={`itemsArea${index}`}>
                                          {item.includes("£") ? (
                                            <div className="flex justify-between">
                                              <div>
                                                {Number.isInteger(
                                                  parseInt(item.charAt(0))
                                                ) && " "}
                                                {item.split("£")[0]}
                                              </div>
                                              <div>£{item.split("£")[1]}</div>
                                            </div>
                                          ) : (
                                            item
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                                <div
                                  id="prices"
                                  className="border-t py-3 text-right"
                                >
                                  {document.item?.receiptInfo?.priceArea?.map(
                                    (item, index) => {
                                      return (
                                        <p key={`priceArea${index}`}>{item}</p>
                                      );
                                    }
                                  )}
                                </div>
                                <div id="bottom" className="border-t py-3">
                                  {document.item?.receiptInfo?.bottomArea?.map(
                                    (item, index) => {
                                      return (
                                        <p key={`bottomArea${index}`}>{item}</p>
                                      );
                                    }
                                  )}
                                </div>
                                {/* site address */}
                                {/* <div>
                          {`${site?.item?.buildingNo}, ${site?.item?.city}, ${site?.item?.postcode}`}
                        </div> */}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  )}

                <div className="px-3 pt-5">
                  <button
                    onClick={() => downloadReceipt(document.item?.id || "")}
                    className="bg-gray-800 text-white font-medium tracking-tight w-full h-16 rounded-full "
                  >
                    download receipt
                  </button>
                </div>
              </Tab.Panel>
            )}
            <Tab.Panel>
              <div className="w-full pt-5 px-4">
                <div>
                  {status === "authenticated" ? (
                    offers && offers.length > 0 && loyalty?.item ? (
                      <LoyaltyCard
                        loyalty={loyalty.item}
                        claimOffer={claimOffer}
                      />
                    ) : offers && offers.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 mt-5">
                        <div className="col-span-2">
                          * You had to get receipt for loyalty program!!!
                        </div>

                        {offers.map((offer) => {
                          if (offer.status !== "passive") {
                            return (
                              <div
                                key={offer.id}
                                className={`bg-white drop-shadow-xl rounded-lg `}
                              >
                                <div className="pt-3 grid justify-items-center ">
                                  <AiOutlineStar size={40} />
                                </div>
                                <div className="pt-3 text-center text-xl">
                                  {offer.name}
                                </div>

                                <div
                                  className={`bg-gradient-to-r
                    from-gray-500 via-gray-600 to-gray-700 focus:ring-gray-300 shadow-gray-500/50
                       focus:ring-4 focus:outline-none shadow-lg  
                      font-medium text-center rounded-b-lg text-white font-semibold py-2 mt-3
                    `}
                                >
                                  claim after {offer.numberOfVisit} visit!
                                </div>
                              </div>
                            );
                          } else return;
                        })}
                      </div>
                    ) : (
                      <div>No offer defined.</div>
                    )
                  ) : (
                    <SignInExplain showBorder={false} offers={offers || []} />
                  )}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <ClaimPage
          isShowing={isClaimPageShowing}
          setIsShowing={setIsClaimPageShowing}
          downCounter={downCounter}
          offerId={offer?.id || ""}
          closeOffer={closeOffer}
          siteName={site?.item?.name}
        />
      </div>
      {/* )} */}
    </>
  );
}

IndexPage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (context) => {
    // id => site id
    // d  => document id
    const d = context?.query?.d as string;
    const id = context?.query?.id as string;
    const { site, document } = store.getState();

    if (id && ((site.item && site.item.id !== id) || site.item === undefined)) {
      await store.dispatch(getSiteAsync(id));
    }

    if (
      d &&
      ((document.item && document.item.id !== d) || document.item === undefined)
    ) {
      await store.dispatch(getDocumentAsync(d));
    } else if (d === undefined) {
      await store.dispatch(clearDocument());
    }

    // console.log(document);

    if (d && id) {
      const sessionRes = await getSession(context);
      if (sessionRes != null) {
        const idToken = sessionRes.id_token as string;
        const role = sessionRes.role as string;

        addDocumentToUser(d, role, idToken);

        await store.dispatch(
          newVisitAsync({ siteId: id, documentId: d, role, idToken })
        );
      }
    }
  }
);

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
