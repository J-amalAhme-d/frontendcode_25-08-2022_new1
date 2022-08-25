import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Stack } from "react-bootstrap";

export default function LandingPage() {
  
  return (
    <Stack className="w-50 text-center">
      <h2>Welcome to the World&apos;s most comprehensive app for athletes to find local sports tryouts and coaches to evaluate accurately in realtime</h2>
      <Button 
        variant="primary" 
        href="/SelectRolePage">
        Get started
      </Button>
    </Stack>
  )
}
