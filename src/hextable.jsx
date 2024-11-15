import React, { useState } from "react";

// Generate hex values for table headers
const generateHexValues = (start, end, step) => {
  const values = [];
  for (let i = start; i <= end; i += step) {
    values.push(i.toString(16).toUpperCase());
  }
  return values;
};

// HexTable Component
const HexTable = ({ hexDict }) => {
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const topHeaders = generateHexValues(0x1000, 0x3fff, 0x100);
  const leftHeaders = generateHexValues(0x00, 0xff, 0x1);

  return (
    <div className="hex-table-wrapper">
      <div className="hex-table-header fontfam">
        <table className="hex-table">
          <thead>
            <tr>
              <th className="hex-header-empty"></th>
              {topHeaders.map((header, index) => (
                <th
                  key={index}
                  className={`hex-header hex-header-top ${hoveredColumn === index ? "highlighted" : ""}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <div className="hex-table-body">
        <table className="hex-table fontfam">
          <tbody>
            {leftHeaders.map((rowHeader, rowIndex) => (
              <tr key={rowIndex}>
                <th className="hex-header hex-header-left">{rowHeader}</th>
                {topHeaders.map((_, colIndex) => (
                  <td
                    className="hex-cell"
                    key={colIndex}
                    onMouseEnter={() => setHoveredColumn(colIndex)}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    {hexDict[
                      (colIndex * 256 + rowIndex + 4096)
                        .toString(16)
                        .toUpperCase()
                    ]
                      ? hexDict[
                          (colIndex * 256 + rowIndex + 4096)
                            .toString(16)
                            .toUpperCase()
                        ]
                      : 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .hex-table-wrapper {
          position: relative;
          max-height: 255px;
          max-width: 590px;
          overflow: auto;
        }

        .hex-table-header {
          position: sticky;
          top: 0;
          background-color: #222020;
          z-index: 2;
        }

        .hex-table {
          border-collapse: collapse;
          width: 3550px;
          table-layout: fixed;
        }

        .hex-header-empty {
          background-color: #222020;
          width: 50px;
        }

        .hex-header,
        .hex-cell {
          text-align: center;
          padding: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .hex-header {
          background-color: #222020;
          color: white;
        }

        .hex-header-top {
          position: sticky;
          top: 0;
          background-color: #222020;
          font-weight: bold;
          z-index: 2;
        }

        tr:hover .hex-header {
          background-color: #767474;
        }

        .row:hover .hex-header-top {
          background-color: #767474;
        }

        .hex-header-left {
          position: sticky;
          left: 0;
          background-color: #222020;
          font-weight: bold;
          z-index: 1;
        }

        .hex-cell {
          background-color: #696969;
        }
        .highlighted {
          background-color: #767474;
        }
      `}</style>
    </div>
  );
};

export default HexTable;
