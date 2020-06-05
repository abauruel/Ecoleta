import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import logo from "../../assets/logo.svg";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./styles.css";

import api from "../../services/api";

import Map from "../../components/Map";
import axios from "axios";
import Modal from "../../components/Modal";
import Dropzone from "../../components/Dropzone";
interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const [items, setItem] = useState<Item[]>([]);
  const [ufs, setUf] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");
  const [latlng, setLatLng] = useState<[number, number]>([0, 0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [selectedfile, setSelectedfile] = useState<File>();
  useEffect(() => {
    async function loadItems() {
      const response = await api.get("items");
      setItem(response.data);
    }

    loadItems();
  }, []);
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUf(ufInitials);
      });
  }, []);
  useEffect(() => {
    if (selectedUf === "0") return;
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cities = response.data.map((city) => city.nome);
        setCities(cities);
      });
  }, [selectedUf]);

  useEffect(() => {}, []);
  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }
  function handleInputData(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }
  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected > -1) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = latlng;
    const items = selectedItems;
    console.log(formData);

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", latitude.toString());
    data.append("longitude", longitude.toString());
    data.append("items", items.join(","));

    if (selectedfile) {
      data.append("image", selectedfile);
    }

    await api.post("points", data);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      history.push("/");
    }, 3000);
  }
  function handleCoordinate(data?: [number, number]) {
    data ? setLatLng(data) : setLatLng([0, 0]);
  }
  return (
    <>
      {showModal ? (
        <Modal showModal={showModal} />
      ) : (
        <div id="page-create-point">
          <header>
            <img src={logo} alt="Ecoleta" />
            <Link to="/">
              <FiArrowLeft />
              Voltar
            </Link>
          </header>
          <form onSubmit={handleSubmit}>
            <h1>
              Cadastro do
              <br /> ponto de coleta
            </h1>
            <Dropzone onFileuploaded={setSelectedfile} />
            <fieldset>
              <legend>
                <h2>Dados</h2>
              </legend>
              <div className="field">
                <label htmlFor="name">Nome da entidade</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={handleInputData}
                />
              </div>
              <div className="field-group">
                <div className="field">
                  <label htmlFor="email">email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleInputData}
                  />
                </div>
                <div className="field">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    id="whatsapp"
                    onChange={handleInputData}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>
                <h2>Endereço</h2>
                <span>Selecione o endereço no mapa</span>
              </legend>

              <Map
                handleGetCoordnate={(data?: [number, number]) =>
                  handleCoordinate(data)
                }
              />
              <div className="field-group">
                <div className="field">
                  <label htmlFor="uf">UF</label>
                  <select
                    name="uf"
                    id="uf"
                    onChange={handleSelectUf}
                    value={selectedUf}
                  >
                    <option value="0">Selecione uma UF</option>
                    {ufs.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="city">city</label>
                  <select
                    name="city"
                    id="city"
                    onChange={handleSelectedCity}
                    value={selectedCity}
                  >
                    <option value="0">Selecione uma Cidade</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>
                <h2>Ítens de coleta</h2>
                <span>Selecione um ou mais itens</span>
              </legend>
              <ul className="items-grid">
                {items.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelectedItem(item.id)}
                    className={
                      selectedItems.includes(item.id) ? "selected" : ""
                    }
                  >
                    <img src={item.image_url} alt={item.title} />
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </fieldset>
            <button type="submit">Cadastrar ponto de coleta</button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreatePoint;
