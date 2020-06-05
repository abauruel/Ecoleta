import React, { useState, useRef, useEffect, useCallback } from "react";
import lottie from "lottie-web";
import success from "../../assets/animations/Succecss.json";
import "./styles.css";
interface PropsModal {
  showModal?: boolean;
}
const Modal = ({ showModal }: PropsModal) => {
  const [modalValue, setModalValue] = useState(showModal);

  let refModal = useRef<HTMLDivElement>(null);
  const loadModal = useCallback(() => {
    if (modalValue) {
      if (!refModal.current) return;
      lottie.loadAnimation({
        container: refModal.current,
        animationData: success,
        autoplay: true,
        loop: false,
      });

      setModalValue(false);
    }
  }, [modalValue]);

  useEffect(() => {
    loadModal();
  }, [loadModal, modalValue]);

  return (
    <div className="container-modal">
      <div className="Modal" ref={refModal}></div>
      <h2>Cadastro realizado com sucesso!</h2>
    </div>
  );
};

export default Modal;
