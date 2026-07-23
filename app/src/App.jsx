import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { Desktops } from "./pages/desktops"
import { Apps } from "./pages/apps"
import { BanIP } from "./pages/banIp"
import { BanLogin } from "./pages/banLogin"
import { Config } from "./pages/config"
import { Layout } from "./Layout"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Desktops />}/>
          <Route path="/apps" element={<Apps />}/>
          <Route path="/banIp" element={<BanIP />}/>
          <Route path="/banLogin" element={<BanLogin />}/>
          <Route path="/config" element={<Config />}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
