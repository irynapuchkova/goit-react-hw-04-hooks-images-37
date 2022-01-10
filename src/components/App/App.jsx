import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import { fetchInfo } from "../../API/fetchimages";
import Searchbar from "../Searchbar/Searchbar";
import Button from "../Button/Button";
import ImageGallery from "../ImageGallery/ImageGallery";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";

import "react-toastify/dist/ReactToastify.css";
import { AppContainer } from "./App.styled";

export default function App() {
  const [images, setImages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(null);
  const [reqStatus, setReqStatus] = useState("idle");
  const [selectedImg, setSelectedImg] = useState("");

  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });

  const handleSearchbarSubmit = (value) => {
    if (value.trim() === "") {
      return toast("PlEASE ENTER YOUR QUERY");
    }

    if (value === inputValue) {
      return;
    }

    setInputValue(value);
    setPage(1);
    setImages([]);
  };

  useEffect(() => {
    if (inputValue.trim() === "") {
      return;
    } else {
      (async function () {
        try {
          setReqStatus("pending");
          const { hits, totalHits } = await fetchInfo(inputValue, 1);
          toast(`We found ${totalHits} images`);
          setImages(hits);
          setTotalHits(totalHits);
          setReqStatus("resolved");
        } catch (error) {
          setReqStatus("rejected");
          console.error(error.message);
        }
      })();
    }
  }, [inputValue]);

  useEffect(() => {
    if (page !== 1) {
      (async function () {
        try {
          setReqStatus("pending");
          const { hits } = await fetchInfo(inputValue, page);
          setImages((prevHits) => [...prevHits, ...hits]);
          setReqStatus("resolved");
        } catch (error) {
          setReqStatus("rejected");
          console.error(error.message);
        }
      })();
    }
  }, [inputValue, page]);

  const onLoadmoreButtonClick = (e) => {
    if (e.currentTarget === e.target) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const toggleModal = () => {
    setSelectedImg(!selectedImg);
  };

  const onSelectedImg = (selectedImage) => {
    setSelectedImg(selectedImage);
  };

  const showBtnLoadMore = images.length >= 12 && images.length < totalHits;

  return (
    <AppContainer>
      <Searchbar onSubmit={handleSearchbarSubmit} />
      <ToastContainer role="alert" autoClose={2000} />
      {reqStatus === "pending" && <Loader />}
      <ImageGallery data={images} onSelect={onSelectedImg} />
      {showBtnLoadMore && <Button onClick={onLoadmoreButtonClick} />}
      {selectedImg && (
        <Modal onClose={toggleModal}>
          <img src={selectedImg.toString()} alt="" />
        </Modal>
      )}
    </AppContainer>
  );
}
