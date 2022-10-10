import { IOffer } from "@/interfaces/loyalty";
import { AiOutlineCheck, AiOutlineStar } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  showBorder: boolean;
  offers: IOffer[];
};

const SignInExplain = ({ showBorder, offers }: Props) => {
  return (
    <div
      className={`${
        showBorder ? "shadow-md shadow-gray-200/60" : ""
      } rounded-3xl  pt-9 pb-5`}
    >
      <div className="flex mb-4 px-4">
        <FaUserCircle size="20" style={{ color: "black" }} />
        <span className="ml-2 -mt-1 tracking-tight font-medium">
          create an account in 10 seconds to
        </span>
      </div>
      <div className="mb-6 px-4">
        <CheckedItem text="access all your receipts in one place" />
        <CheckedItem text="earn points with your receipt" />
        <CheckedItem text="get special offers from your favorite shops" />
        <CheckedItem text="you had to collect your receipt for loyalty program!!!" />
      </div>
      {!showBorder && (
        <div className="grid grid-cols-2 gap-4 mt-5">
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
                  <div className="pt-3 text-center text-xl">{offer.name}</div>

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
      )}
    </div>
  );
};

const CheckedItem = ({ text }: any) => {
  return (
    <div className="flex mb-2">
      <AiOutlineCheck size="20" style={{ color: "#535353" }} />
      <span className="text-[#535353] ml-1 tracking-tight text-sm">{text}</span>
    </div>
  );
};

export default SignInExplain;
