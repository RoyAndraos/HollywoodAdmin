import { useContext } from "react";
import { ServicesContext } from "../contexts/ServicesContext";
const Services = () => {
  const { services } = useContext(ServicesContext);
  return (
    <div>
      <ul>
        {services.map((service) => {
          return (
            <li key={service._id}>
              <div>
                <span>service: {service.name}</span>
                <div>
                  <input
                    placeholder={service.price.split("$")[0]}
                    type="number"
                  ></input>
                  $
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Services;
