import { Table } from "antd";

const AntdTable = ({ data,columns,width }) => {
  return (
    <div className="mx-auto" style={{ maxWidth: width,overflowX:"auto"}}>
      <Table dataSource={data} columns={columns}  />
    </div>
  );
};

export default AntdTable;
