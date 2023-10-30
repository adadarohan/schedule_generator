import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

export default function Submit(props) {
  
  const navigate = useNavigate()

  ReactGA.event({
    category: "generate_lead",
    action: "schedule_created"
  });

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

    let json_string = JSON.stringify(props.userPrefs)
    let is_errored = false

    fetch("https://ufm2ujglzj6q55eplsst6nhxbu0erlzn.lambda-url.us-east-2.on.aws/?data=" + encodeURIComponent(json_string) )
    .then(response => {
      
      if (response.status == 400) {
        console.log("Bad request", response)
        is_errored = true
        return response.json()
      } 
      
      if (!response.ok) {
        console.log("Unknown error from server")
        navigate("/error?error=Unknown%20Error")
      }

      try {
        return response.json()
      } catch {
        console.log("Unknown error from server")
        navigate("/error?error=Unknown%20Error")
      }

    })
    .then(data => {
      if (data.length == 0) {
        console.log("No results")
        navigate("/error?error=No%20Results")
        return
      }

      if (is_errored) {
        if (data == "overflow") {
          console.log("Overflow error")
          navigate("/overflow")
          return
        }
        console.log("Error from server 1", data)
        navigate("/error?error=" + encodeURIComponent(data))
        return
      }

      props.setSchedules(data)
      navigate("/results")
    })
  }, [])

  return (
    <div className="font-serif">
        <div className="pl-5 sm:pl-10 pt-32">
          <h2 className="text-4xl sm:text-7xl">the magic</h2>
          <h1 className="font-display text-5xl sm:text-[84px] pt-2 loading">is happening </h1>
        </div>

        <h5 className="text-2xl sm:text-4xl px-5 sm:pl-10 pt-32 sm:pt-20">this can sometimes take a minute or two</h5>
    </div>
  );
}