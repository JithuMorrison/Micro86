
import React from 'react';
import './App.css'
import HexTable from './hextable';

const TableComponent = ({registers,flag,pointers,hexDict}) => {
  return (
    <div>
    <div className='tabl-container'>
    <div className="table-container fontfam">
      <table>
        <thead>
          <tr>
            <th className='ch'>REG</th>
            <th>H</th>
            <th>L</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='ch'>A</td>
            <td>{registers['AX'].toString(16).slice(-4,-2).padStart(2, '0').toUpperCase()}</td>
            <td>{registers['AX'].toString(16).slice(-2).padStart(2, '0').toUpperCase()}</td>
          </tr>
          <tr>
            <td className='ch'>B</td>
            <td>{registers['BX'].toString(16).slice(-4,-2).padStart(2, '0').toUpperCase()}</td>
            <td>{registers['BX'].toString(16).slice(-2).padStart(2, '0').toUpperCase()}</td>
          </tr>
          <tr>
            <td className='ch'>C</td>
            <td>{registers['CX'].toString(16).slice(-4,-2).padStart(2, '0').toUpperCase()}</td>
            <td>{registers['CX'].toString(16).slice(-2).padStart(2, '0').toUpperCase()}</td>
          </tr>
          <tr>
            <td className='ch'>D</td>
            <td>{registers['DX'].toString(16).slice(-4,-2).padStart(2, '0').toUpperCase()}</td>
            <td>{registers['DX'].toString(16).slice(-2).padStart(2, '0').toUpperCase()}</td>
          </tr>
        </tbody>
      </table>
    </div>
      <div className="table-container fontfam">
        <table>
          <thead>
            <tr>
              <th className='ch'>SEGMENT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='ch' >CS</td>
              <td>0000</td>
            </tr>
            <tr>
              <td className='ch'>DS</td>
              <td>0000</td>
            </tr>
            <tr>
              <td className='ch'>ES</td>
              <td>0000</td>
            </tr>
            <tr>
              <td className='ch'>:)</td>
              <td>TQ</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="table-container fontfam">
        <table>
          <thead>
            <tr>
              <th className='ch'>POINTER</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='ch'>SI</td>
              <td>{pointers['SI'].toString(16).slice(-4).padStart(4, '0').toUpperCase()}</td>
            </tr>
            <tr>
              <td className='ch'>DI</td>
              <td>{pointers['DI'].toString(16).slice(-4).padStart(4, '0').toUpperCase()}</td>
            </tr>
            <tr>
              <td className='ch'>BP</td>
              <td>{pointers['BP'].toString(16).slice(-4).padStart(4, '0').toUpperCase()}</td>
            </tr>
            <tr>
              <td className='ch'>SP</td>
              <td>{pointers['SP'].toString(16).slice(-4).padStart(4, '0').toUpperCase()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      <div className="table-container fontfam">
        <table className='table2'>
          <thead>
            <tr>
              <th className='lh ch'>FLAG</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='ch'>OF</td>
              <td>DF</td>
              <td>IF</td>
              <td>TF</td>
              <td>SF</td>
              <td>ZF</td>
              <td>AF</td>
              <td>PF</td>
              <td>CF</td>
            </tr>
            <tr>
              <td className='ch'>{flag['OF'].toString()}</td>
              <td>{flag['DF'].toString()}</td>
              <td>{flag['IF'].toString()}</td>
              <td>{flag['TF'].toString()}</td>
              <td>{flag['SF'].toString()}</td>
              <td>{flag['ZF'].toString()}</td>
              <td>{flag['AF'].toString()}</td>
              <td>{flag['PF'].toString()}</td>
              <td>{flag['CF'].toString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <HexTable hexDict={hexDict}/>
      </div>
  );
};

export default TableComponent;
