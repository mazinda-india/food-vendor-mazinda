import { Oval } from "react-loader-spinner";

const OvalLoader = () => {
  return (
    <div className="flex justify-center">
      <Oval
        height={20}
        width={20}
        color="white"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="black"
        strokeWidth={5}
        strokeWidthSecondary={5}
      />
    </div>
  );
};

export default OvalLoader;
