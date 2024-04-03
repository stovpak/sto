'use client';

import { useCookies } from 'next-client-cookies';
import {Login} from "@/app/componets/login";
import {useState, useEffect} from "react";
import axios from "axios";
import {XANO_DB_URL} from "@/helpers/consts";

export const MainContent = () => {
  const cookies = useCookies();
  const isLogged = cookies.get('token');

  const getCarsUrl = `${XANO_DB_URL}/car`;
  const createCarUrl = `${XANO_DB_URL}/car`;
  const createNoteUrl = `${XANO_DB_URL}/notes`
  const getCarNotesUrl = (id) => `${XANO_DB_URL}/car/notes/${id}`;
  const getCar = (number) => `${XANO_DB_URL}/car/search/${number}`;


  const [searchValue, setSearchValue]  = useState('');
  const [carsList, setCarsList] = useState([]);
  const [carNotes, setCarNotes] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [selectedCarNumber, setSelectedCarNumber] = useState(null);
  const [noteText, setNoteText] = useState(null);
  const [newCar, setNewCar] = useState(null);

  async function createNewCar () {
    if (newCar) {
      await axios.post(createCarUrl, {
        number: newCar
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      setNewCar(null);

      await initialCarSync();
    }
}


  async function onSearchSubmit () {
    const { data } = await axios.get(getCar(searchValue));
    setCarsList(data);
  }

  async function onCarClick (id, number) {
    setCarNotes([]);
    setSelectedCarId(id);
    setSelectedCarNumber(number);
    const { data } = await axios.get(getCarNotesUrl(id));
    setCarNotes(data);
  }

  async function initialCarSync () {
    const { data } = await axios.get(getCarsUrl);
    setCarsList(data);
  }

  async function createNote () {
    if (noteText && selectedCarId) {
      await axios.post(createNoteUrl, {
        note: noteText,
        car_id: selectedCarId
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      setNoteText(null);

      await onCarClick(selectedCarId, selectedCarNumber);
    }
  }

  useEffect(() => {
    initialCarSync();
  }, []);

  return (
    <div>
      {isLogged
        ? <div className="flex">
            <div className="flex flex-col">
              <div>
                <input type="text"
                       name="search"
                       className="text-black"
                       value={searchValue}
                       onChange={(event) => {setSearchValue(event.target.value)}}
                />
                <button className="ml-2" type="submit" onClick={onSearchSubmit}>Искать</button>
              </div>
              <div className="flex bg-white mt-4 flex-col">
                {carsList.map((car) =>
                  <div key={car.id} className="mt-6" onClick={() => {onCarClick(car.id, car.number)}}>
                    <p className="text-black">{car.number}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col mt-6">
                <input className="text-black" value={newCar} onChange={(event) => {setNewCar(event.target.value)}}></input>
                <button className="mt-4 bg-lime-700" onClick={createNewCar}>Добавить новый номер</button>
              </div>
            </div>
            <div className="ml-4">
              <p>Заметки для {selectedCarNumber}</p>
              {carNotes.map((note) => (
                <div key={note.key} className="mt-2 bg-white">
                  <p className="text-black">{note.note}</p>
                </div>
              ))}
              {selectedCarNumber &&
                <div className="flex flex-col mt-6">
                  <textarea className="text-black" value={noteText} onChange={(event) => {setNoteText(event.target.value)}}></textarea>
                  <button className="mt-4 bg-lime-700" onClick={createNote}>Оставить заметку для {selectedCarNumber}</button>
                </div>
              }
            </div>
          </div>
        :
          <>
            <Login />
          </>}
    </div>
  );
}
