import { Table } from "antd";

const AntdTable = ({ data,columns,width }) => {
  return (
    <div className="mx-auto" style={{ width: width}}>
      <Table dataSource={data} columns={columns}  />
    </div>
  );
};

export default AntdTable;
