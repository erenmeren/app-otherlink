import { Fragment } from "react";

import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { VscChevronDown } from "react-icons/vsc";

import { BsChevronDown } from "react-icons/bs";
import moment from "moment-timezone";
import { useAppSelector } from "@/app/hooks";
import { UserInfoState } from "@/features/user/slice";
// import { IDocument } from "@/interfaces/document";

type Props = {
  isShowing: any;
  setIsShowing: any;
};

interface GlobalState {
  user?: UserInfoState;
}

const downloadUrl = process.env.NEXT_PUBLIC_DOCUMENT_DOWNLOAD_URL;

const todayDate = new Date().toISOString().slice(0, 10);

const Receipt = ({ isShowing, setIsShowing }: Props) => {
  const { user } = useAppSelector<GlobalState>((state) => state);

  const sortedDocuments = (user && user.item && user.item.documents) || [];

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
                            receipts
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
                        <div className="m-5">
                          {/* list of receipts */}
                          <div className="my-4 ">Today</div>
                          {sortedDocuments.map((document, index) => {
                            return (
                              document.createdAt?.includes(todayDate) && (
                                <Document
                                  key={`newReceiptListNew_${index}_${document.id}`}
                                  document={document}
                                />
                              )
                            );
                          })}

                          <div className="my-4">Older</div>
                          {sortedDocuments.map((document, index) => {
                            return (
                              !document.createdAt?.includes(todayDate) && (
                                <Document
                                  key={`newReceiptListOlder_${index}_${document.id}`}
                                  document={document}
                                />
                              )
                            );
                          })}
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

const downloadReceipt = (id: string) => {
  if (typeof window !== "undefined" && id !== "") {
    window.open(downloadUrl + "/" + id, "_blank");
  }
};

const timeFormat = (timeStr: string): string => {
  const utcCutoff = moment.utc(timeStr, "YYYY-MM-DD HH:mm:ss");
  const displayCutoff = utcCutoff.clone().tz("Europe/London");

  return displayCutoff.format("YYYY-MM-DD HH:mm:ss");
};

const Document = ({ document }: any) => {
  return (
    <div className="shadow-md shadow-gray-200/60 pb-5 bg-gray-100 static my-3">
      <div className="w-full pt-5 px-4">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between text-base font-semibold text-gray-600 font-serif outline-none">
                <img
                  className="inline object-cover w-10 h-10 rounded-full mt-1"
                  // src="{site?.item?.imageURL}"
                  src="/jb.jpg"
                  width={10}
                  height={10}
                  alt="site image"
                />
                <span>
                  {document?.siteName}

                  <br />
                  <span className="text-sm">
                    {timeFormat(document?.createdAt)}
                  </span>
                </span>
                {document.receiptInfo?.totalPrice && (
                  <>
                    <span>
                      Total:{" "}
                      {document.receiptInfo?.totalPrice !== "-"
                        ? "£" + document.receiptInfo?.totalPrice
                        : document.receiptInfo?.totalPrice}
                      {/* <br />
                      Loyalty: {document.receiptInfo?.point} */}
                    </span>
                  </>
                )}

                <BsChevronDown
                  className={`${open ? "rotate-180 transform" : ""} h-5 w-5`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-5 px-3 flex flex-col ">
                {document.receiptInfo?.totalPrice && (
                  <div className="flex justify-center">
                    <div className="bg-white drop-shadow-2xl w-2/3 p-2">
                      <div className="text-center text-lg font-semibold">
                        {document.receiptInfo?.siteName}
                      </div>

                      <div className="py-3 text-sm text-gray-600">
                        {document.receiptInfo?.dateArea?.map(
                          (item: string, index: any) => {
                            return (
                              <p key={`dateArea${index}`} className="">
                                {item}
                              </p>
                            );
                          }
                        )}
                      </div>

                      <div id="items" className="border-t py-3 ">
                        {document.receiptInfo?.itemsArea?.map(
                          (item: string, index: any) => {
                            return <p key={`itemsArea${index}`}>{item}</p>;
                          }
                        )}
                      </div>
                      <div id="prices" className="border-t py-3 text-right">
                        {document.receiptInfo?.priceArea?.map(
                          (item: string, index: any) => {
                            return <p key={`priceArea${index}`}>{item}</p>;
                          }
                        )}
                      </div>
                      <div id="bottom" className="border-t py-3">
                        {document.receiptInfo?.bottomArea?.map(
                          (item: string, index: any) => {
                            return <p key={`bottomArea${index}`}>{item}</p>;
                          }
                        )}
                      </div>
                      <div className="px-3 pt-5"></div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => downloadReceipt(document?.id || "")}
                    className="bg-gray-800 text-white font-medium tracking-tight w-full h-16 rounded-full "
                  >
                    download receipt
                  </button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default Receipt;
