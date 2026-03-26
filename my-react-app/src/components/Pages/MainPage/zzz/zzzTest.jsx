// // import React from 'react'
// // import testStyles from './zzzTestStyles.module.css'

// // export default function zzzTest() {
// //   return (
// //     <div className={testStyles.roadMapContainer}>
// //         <div className={testStyles.circle}>1</div>
// //         <div className={testStyles.lineCircle}></div>
// //         <div className={testStyles.circle}>2</div>
// //         <div className={testStyles.lineCircle}></div>
// //         <div className={testStyles.circle}>3</div>
// //         <div className={testStyles.lineCircle}></div>
// //         <div className={testStyles.circle}>4</div>
// //     </div>
// //   )
// // }







import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  BOX: 'box',
};

// Компонент перетаскиваемого элемента
function DraggableBox({ id, text, moveBox }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '8px',
        backgroundColor: 'lightblue',
        cursor: 'move',
      }}
    >
      {text}
    </div>
  );
}

// Зона, куда можно сбросить элементы
function DropZone({ boxes, setBoxes }) {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item, monitor) => {
      const id = item.id;
      // Добавляем элемент в зону если его там нет
      if (!boxes.find((b) => b.id === id)) {
        setBoxes((prev) => [...prev, { id, text: `Box ${id}` }]);
      }
    },
  }));

  return (
    <div
      ref={drop}
      style={{
        minHeight: '150px',
        padding: '16px',
        border: '2px dashed gray',
        marginTop: '20px',
      }}
    >
      {boxes.map((box) => (
        <div key={box.id} style={{ padding: '4px', margin: '4px', backgroundColor: 'lightgreen' }}>
          {box.text}
        </div>
      ))}
      {boxes.length === 0 && <p>Перетащите сюда элементы</p>}
    </div>
  );
}

function App() {
  const [boxes, setBoxes] = useState([]);

  // Исходные элементы для перетаскивания
  const availableBoxes = [
    { id: 1, text: 'Заголовок' },
    { id: 2, text: 'Текст' },
    { id: 3, text: 'Изображение' },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
        <div>
          <h3>Элементы</h3>
          {availableBoxes.map((box) => (
            <DraggableBox key={box.id} id={box.id} text={box.text} />
          ))}
        </div>
        <div>
          <h3>Конструктор страниц</h3>
          <DropZone boxes={boxes} setBoxes={setBoxes} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;







// // Бургер панель
// import React, { useState } from 'react'
// import testStyles from './zzzTestStyles.module.css'

// export default function zzzTest() {

//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   }

//   return (
//     <div className={testStyles.Container} onClick={toggleMenu}>
//       a
//       <div className={testStyles.burgerContainer}>
//         <div className={testStyles.burgerLine}></div>
//         <div className={testStyles.burgerLine}></div>
//         <div className={testStyles.burgerLine}></div>
//       </div>

//       {menuOpen && (
//         <div className={testStyles.menuPanel}>
//           <li><a href="#">1111</a></li>
//           <li><a href="#">2222</a></li>
//           <li><a href="#">3333</a></li>
//           <li><a href="#">4444</a></li>
//           <li><button>5555</button></li>
//         </div>
//       )}

//     </div>
//   )
// }
