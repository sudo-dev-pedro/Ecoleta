import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import './createPoint.css';
import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
};

interface IBGEUFResponse {
    sigla: string;
};

interface IBGECityResponse {
    nome: string;
};

const CreatePoint = () => {

    const [ items, setItems ] = useState<Item[]>([]);
    const [ ufs, setUFs ] = useState<string[]>([]);
    const [ cities, setCities ] = useState<string[]>([]);

    const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0,0]);
    const [ formData, setFormData ] = useState({
        name: '' ,
        email: '',
        whatsapp: '',
    });

    const [ selectedUF, setSelectedUF ] = useState('0');
    const [ selectedCity, setSelectedCity ] = useState('0');
    const [ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0,0]);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const UFs = response.data.map(uf => uf.sigla);

            setUFs(UFs);
        });
    }, []);
    
    useEffect(() => {
        if (selectedUF === '0'){
            return;
        }   
    });

    useEffect(() => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {

            const citiesNames = response.data.map(city => city.nome); 
    
            setCities(citiesNames);

        });
    }, [selectedUF]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        });
    }, []);

    function capturarSelectedUF(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setSelectedUF(uf);
    };

    function capturarSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSelectedCity(city);
    };

    function handleMapClick(event: LeafletMouseEvent ) {

        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ]);
    };

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){

        const { name, value } = event.target;

        setFormData({ ...formData,  [name]: value });
    };

    function handleSelectItem(){
        
    };

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>

            </header>

            <form>
                <h1>Cadastro do <br/> Ponto de Coleta</h1>
                
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
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="name">WhatsApp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={13} onClick={handleMapClick}>
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="UF">Estado (UF)</label>
                                <select  
                                    name="UF" 
                                    id="UF" 
                                    value={selectedUF} 
                                    onChange={capturarSelectedUF}
                                >
                                <option value="0">Selecione a UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))};
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                                <select 
                                    name="city" 
                                    id="city"
                                    value={selectedCity}
                                    onChange={capturarSelectedCity} 
                                >

                                <option value="0">Selecione a Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))};
                            </select>
                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {items.map(item => (
                            <li key={item.id} onClick={handleSelectItem}>
                                <img src={item.image_url} alt=""/>
                                <span>{item.title}</span>
                            </li>
                        ))};

                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto
                </button>

            </form>
        </div>
    );
};

export default CreatePoint;