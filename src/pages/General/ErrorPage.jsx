import { Button, Result } from "antd";

export default function ErrorPage() {
  return (
    <div className="mx-auto mt-5">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button className="text-decoration-none" href="/" type="primary">
            Back to home
          </Button>
        }
      />
    </div>
  );
}
