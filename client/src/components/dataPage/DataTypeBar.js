import { useState } from "react";
import DatePicker from "react-datepicker";
import "../availability/datepick.css";
import styled from "styled-components";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { getDateRange } from "../helpers";
import { FaSearch } from "react-icons/fa";
import { useEffect } from "react";
const DataTypeBar = ({ date, setDate, type, setType }) => {
  const [isCalendarClicked, setIsCalendarClicked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMonday = (date) => {
    const day = date.getDay();
    return day === 1; // 1 for Monday
  };
  //check if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNext = (date, type) => {
    if (type === "week") {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 7);
      setDate(newDate);
    }
    if (type === "month") {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      setDate(newDate);
    }
    if (type === "year") {
      const newDate = new Date(date);
      newDate.setFullYear(newDate.getFullYear() + 1);
      setDate(newDate);
    }
  };

  const handlePrevious = (date, type) => {
    if (type === "week") {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 7);
      setDate(newDate);
    }
    if (type === "month") {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() - 1);
      setDate(newDate);
    }
    if (type === "year") {
      const newDate = new Date(date);
      newDate.setFullYear(newDate.getFullYear() - 1);
      setDate(newDate);
    }
  };
  return (
    <Wrapper $isScrolled={isScrolled}>
      <ButtonWrapper>
        <Button $isSelected={type === "week"} onClick={() => setType("week")}>
          Week
        </Button>
        <Button $isSelected={type === "month"} onClick={() => setType("month")}>
          Month
        </Button>
        <Button $isSelected={type === "year"} onClick={() => setType("year")}>
          Year
        </Button>
      </ButtonWrapper>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5vw",
          borderRight: "1px solid #035e3f",
          paddingRight: "2vw",
        }}
      >
        <NextButton
          onClick={() => {
            handlePrevious(date, type);
          }}
        />
        {isCalendarClicked &&
          (type === "week" ? (
            <DatePicker
              selected={date}
              dateFormat="MMMM dd yyyy"
              filterDate={isMonday}
              open={true}
              customInput={<CustomInput />}
              onChange={(dateS) => {
                setDate(dateS);
                setIsCalendarClicked(false);
              }}
            />
          ) : type === "month" ? (
            <DatePicker
              selected={date}
              dateFormat="MMMM yyyy"
              open={true}
              customInput={<CustomInput />}
              showMonthYearPicker
              onChange={(dateS) => {
                setDate(dateS);
                setIsCalendarClicked(false);
              }}
            />
          ) : type === "year" ? (
            <DatePicker
              selected={date}
              open={true}
              dateFormat="yyyy"
              showYearPicker
              onChange={(dateS) => {
                setDate(dateS);
                setIsCalendarClicked(false);
              }}
            />
          ) : null)}
        <CurrentDate
          onClick={() => {
            setIsCalendarClicked(!isCalendarClicked);
          }}
        >
          {type === "week" &&
            getDateRange(date, type).startDate.toString().slice(0, 11) +
              " - " +
              getDateRange(date, type).endDate.toString().slice(0, 11)}
          {type === "month" &&
            getDateRange(date, type).startDate.toString().slice(3, 8) +
              getDateRange(date, type).startDate.toString().slice(11, 15) +
              " - " +
              getDateRange(date, type).endDate.toString().slice(3, 8) +
              getDateRange(date, type).endDate.toString().slice(11, 15)}
          {type === "year" &&
            getDateRange(date, type).startDate.toString().slice(11, 15) +
              " - " +
              getDateRange(date, type).endDate.toString().slice(11, 15)}
        </CurrentDate>
        <PreviousButton
          onClick={() => {
            handleNext(date, type);
          }}
        />
      </div>
      <SearchButton>Search</SearchButton>
    </Wrapper>
  );
};
const CurrentDate = styled.div`
  width: 25vw;
  border: 1px solid #035e3f;
  padding: 1vh 0;
  font-weight: bold;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 20px;
  text-align: center;

  transition: all 0.3s ease-in-out;
  &:read-only {
    cursor: default;
  }
`;

const SearchButton = styled(FaSearch)`
  cursor: pointer;
  font-size: 1.5rem;
  color: #035e3f;
  background-color: #eeebde;
  padding: 0.5vw;
  border-radius: 50%;
  border: 3px solid #035e3f;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #035e3f;
    color: white;
  }
  &:active {
    background-color: #011c13;
    scale: 0.9;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  z-index: 1000;
  align-items: center;
  font-family: "Roboto", sans-serif;
  gap: 2vw;
  padding: 3vh 0;
  margin: ${(props) => (props.$isScrolled ? "-4vh 7vw" : "5vh 7vw")};
  border: 3px solid rgba(3, 94, 63, 0.2);
  border-radius: 50px;
  background-color: #eeebde;
  color: #035e3f;
  width: 86vw;
  position: fixed;
  transition: all 0.3s ease-in-out;
`;

const ButtonWrapper = styled.div`
  width: 30vw;
  border-right: 1px solid #035e3f;
  padding-right: 2vw;
`;
const Button = styled.button`
  width: 33%;
  border: 1px solid #035e3f;
  padding: 1vh 0;
  font-size: 1rem;
  cursor: pointer;
  color: ${(props) => (props.$isSelected ? "white" : "#035e3f")};
  transition: all 0.3s ease-in-out;
  background-color: ${(props) => (props.$isSelected ? "#035e3f" : "white")};

  &:first-of-type {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  &:last-of-type {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
  &:hover {
    background-color: #011c13;
    color: white;
  }
`;
const NextButton = styled(BsArrowLeftCircle)`
  border: none;
  cursor: pointer;
  background-color: #eeebde;
  font-size: 3rem;
  border-radius: 50%;
  color: #035e3f;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
  &:hover {
    color: #eeebde;
    background-color: #035e3f;
    border: 2px solid #035e3f;
  }
  &:active {
    scale: 0.9;
    background-color: #011c13;
    border: 2px solid #011c13;
  }
`;

const PreviousButton = styled(BsArrowRightCircle)`
  border: none;
  cursor: pointer;
  background-color: #eeebde;
  font-size: 3rem;
  border-radius: 50%;
  color: #035e3f;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
  &:hover {
    color: #eeebde;
    background-color: #035e3f;
    border: 2px solid #035e3f;
  }
  &:active {
    scale: 0.9;
    background-color: #011c13;
    border: 2px solid #011c13;
  }
`;
const CustomInput = styled.input`
  display: none;
  z-index: 1000;
`;
export default DataTypeBar;
