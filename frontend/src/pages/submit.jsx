import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Submit(props) {
  
  const navigate = useNavigate()

  const encodeGetParams = p => Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

  useEffect(() => {

    // Data Validation
    console.log(props.userPrefs)

    if (props.userPrefs.classes.length == 0) {
      console.log("No classes")
      navigate("/")
      return
    }

    if (('start_time' in props.userPrefs) == false) {
      console.log("No start time")
      navigate("/")
      return
    }

    if (('end_time' in props.userPrefs) == false) {
      console.log("No end time")
      navigate("/")
      return
    }

    if (('open_sections_only' in props.userPrefs) == false) {
      console.log("No open sections only")
      navigate("/")
      return
    }

    if (('max_distance' in props.userPrefs) == false) {
      console.log("No max distance")
      navigate("/")
      return
    }

    if (('back_to_back' in props.userPrefs) == false) {
      console.log("No back to back")
      navigate("/")
      return
    }

    if (('pref_time' in props.userPrefs) == false) {
      console.log("No pref time")
      navigate("/")
      return
    }

    if (('lunch' in props.userPrefs) == false) {
      console.log("No lunch")
      navigate("/")
      return
    }

    fetch("https://ufm2ujglzj6q55eplsst6nhxbu0erlzn.lambda-url.us-east-2.on.aws/" + encodeGetParams(props.userPrefs))
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
  }, [])

  return (
    <div className="font-serif">
        <div className="pl-10 pt-32">
          <h2 className="text-7xl">the magic</h2>
          <h1 className="font-display text-[84px] pt-2 loading">is happening </h1>
        </div>

        <h5 className="text-4xl pl-10 pt-20">this can sometimes take a minute or two</h5>
    </div>
  );
}