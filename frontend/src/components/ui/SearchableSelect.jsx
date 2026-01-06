import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

// Icono de flecha (SVG simple para no depender de librerías externas)
const ChevronUpDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

export default function SearchableSelect({
  items,          // Array de objetos (ej: clientes)
  selectedItem,   // El objeto seleccionado actualmente
  onChange,       // Función para actualizar el estado padre
  displayKey,     // Qué propiedad del objeto mostrar (ej: "nombre_cliente")
  placeholder,
  label,
  disabled = false,
  error = null
}) {
  const [query, setQuery] = useState('');

  // Filtrado local de datos
  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item[displayKey]
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className="w-full relative">
      {label && <label className="block text-sm font-medium text-dark-gray mb-1">{label}</label>}
      
      <Combobox value={selectedItem} onChange={onChange} disabled={disabled} nullable>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-md bg-gray-100 text-left border border-gray-300 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500 shadow-sm sm:text-sm">
            <Combobox.Input
              className={`w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 bg-gray-100 focus:ring-0 ${disabled ? 'cursor-not-allowed text-gray-500' : ''}`}
              displayValue={(item) => (item ? item[displayKey] : '')}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              style={error ? { borderColor: 'red' } : {}}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon />
            </Combobox.Button>
          </div>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            {/* AQUÍ ESTÁ LA MAGIA DEL TAMAÑO Y SCROLL: max-h-60 overflow-auto */}
            <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredItems.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <Combobox.Option
                    key={index} // Usa un ID único si lo tienes, sino index
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-sky-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {item[displayKey]}
                        </span>
                        {selected ? (
                          <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-sky-600'}`}>
                            <CheckIcon />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}