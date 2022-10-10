import { ILoyalty } from "@/interfaces/loyalty";
import { Disclosure } from "@headlessui/react";
import { AiOutlineGift, AiOutlineStar } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

const getVisitBoxes = (loyalty: ILoyalty) => {
  const boxes = [];
  const offerClaimNumbers: number[] = [];
  let maxClaimNumber = -1;
  let minClaimNumber = Number.MAX_SAFE_INTEGER;

  loyalty.offers?.forEach((offer) => {
    if (offer.status !== "passive") {
      offerClaimNumbers.push(offer.numberOfVisit);
      if (maxClaimNumber < offer.numberOfVisit)
        maxClaimNumber = offer.numberOfVisit;
      if (minClaimNumber > offer.numberOfVisit)
        minClaimNumber = offer.numberOfVisit;
    }
  });

  const isClaim = minClaimNumber <= loyalty.numberOfVisit;

  // loyalty.claimNumber -= 1;
  for (let index = 1; index < 11; index++) {
    boxes.push(
      <div
        key={`loyaltyBoxIndex_${index}_${loyalty.siteId}`}
        className="h-6 w-6 rounded-full border-dashed border-slate-700 border-2 text-center"
      >
        {loyalty.numberOfVisit >= index &&
          maxClaimNumber !== index &&
          minClaimNumber !== index && (
            <BsCheckLg
              size="18"
              className={`pl-0.5 pt-1`}
              style={isClaim ? { color: "#1d4ed8" } : {}}
            />
          )}
        {offerClaimNumbers.includes(index) && (
          <AiOutlineGift
            size="19"
            className={`pl-[1px]`}
            style={isClaim ? { color: "#1d4ed8" } : {}}
          />
        )}
      </div>
    );
  }
  return boxes;
};

type Props = {
  loyalty: ILoyalty;
  claimOffer: any;
};

const LoyaltyBox = ({ loyalty, claimOffer }: Props) => {
  return (
    <>
      <div className={`drop-shadow-xl rounded-md bg-[#f3f4f6] my-2`}>
        <Disclosure>
          <Disclosure.Button className="w-full p-2 flex">
            <div className="grid justify-items-center mt-2.5">
              <img
                className="w-15 h-15 rounded-full"
                // src="{site?.item?.imageURL}"
                src="/jb.jpg"
                width={70}
                height={70}
                alt="site image"
              />
            </div>
            <div className="pl-2">
              <div className="text-left text-xl font-semibold">
                {loyalty.siteName}
              </div>
              <div className="mt-2 justify-items-center grid grid-cols-10 gap-2 lg:gap-4">
                {getVisitBoxes(loyalty)}
              </div>
              {/* <div className="mt-2 flex justify-between">{loyalty.offer}</div> */}
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="p-2">
            <div className="grid grid-cols-2 gap-4 mt-5">
              {loyalty.offers?.map((offer) => {
                if (offer.status !== "passive") {
                  const isClaim = offer.numberOfVisit <= loyalty.numberOfVisit;
                  return (
                    <div
                      key={offer.id}
                      className={`bg-white drop-shadow-xl rounded-lg ${
                        !isClaim ? "blur-[2px] cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="pt-3 grid justify-items-center ">
                        <AiOutlineStar
                          size={40}
                          style={isClaim ? { color: "#1d4ed8" } : {}}
                        />
                      </div>
                      <div className="pt-3 text-center text-xl">
                        {offer.name}
                      </div>
                      <div className="pt-3 text-center text-sm tracking-tight text-slate-600 ">
                        Take your {offer.name}
                        <br />
                        Free Now!
                      </div>
                      <div
                        className={`bg-gradient-to-r
                    ${
                      isClaim
                        ? "from-blue-500 via-blue-600 to-blue-700 focus:ring-blue-300 shadow-blue-500/50 cursor-pointer hover:bg-gradient-to-br"
                        : "from-gray-500 via-gray-600 to-gray-700 focus:ring-gray-300 shadow-gray-500/50"
                    }
                       focus:ring-4 focus:outline-none shadow-lg  
                      font-medium text-center rounded-b-lg text-white font-semibold py-2 mt-3
                    `}
                        onClick={() => claimOffer(loyalty, offer)}
                      >
                        claim now
                      </div>
                    </div>
                  );
                } else return;
              })}
            </div>
          </Disclosure.Panel>
        </Disclosure>
      </div>
    </>
  );
};

export default LoyaltyBox;
