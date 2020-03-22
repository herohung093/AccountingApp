import * as React from "react";
type TableProps = {
  listOfHeader: String[];
  handleClick: (value: string) => void;
};
const TableHeader: React.FC<TableProps> = props => {
  return (
    <thead style={{ cursor: "pointer", textAlign: "center", position: "sticky" }}>
      <tr>
        {props.listOfHeader.map(item => {
          return <th key={Math.random()} onClick={() => {
            let firstCharacter = item.charAt(0).toLowerCase();
            const theRest = item.substr(1, item.length);
            props.handleClick((firstCharacter + theRest).split(' ').join(''))
          }
          }>{item}</th>;
        })}
      </tr>
    </thead>
  );
};
export default TableHeader;
