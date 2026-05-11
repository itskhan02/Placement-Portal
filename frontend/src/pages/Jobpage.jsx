import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../utils/config';
// import Jobform from '../components/Jobform';
// import Joblist from '../components/Joblist';
import { Box, Alert,Snackbar } from '@mui/material';

const Jobpage = () => {
  const [jobs, setJobs] = useState([]);
  const [toast, setToast] = useState({open:false, msg:"", type:"success"});
  const showToast = (msg, type="success") => setToast({open:true, msg, type});
  const closeToast = ()=> setToast(p=>({...p, open:false}));

  const fetchjobs = async () => {
    try{
      const res = await axios.get(`${API_BASE_URL}/jobs`);
      setJobs(res.data.jobs || []);
    } catch(e) {
      console.error(e);
    }
  };

  //read all jobs
  useEffect(()=> {
    void fetchjobs();
  },[]);

//delete job 
  const deletejob = async (id) => {
    try{
      const res = await axios.delete(`${API_BASE_URL}/jobs/${id}`);
      showToast(res.data.msg || "Job deleted successfully");
      setJobs((prev)=> prev.filter((job)=> job._id !== id));
    } catch(e) {
      showToast(e?.response?.data?.msg || "error deleting job", "error");
    }
  }


  return <>
      <Box>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Job Listings</h1>
          {jobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="rounded border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{job.title}</h2>
                    <p className="text-sm text-gray-600">{job.location}</p>
                  </div>
                  <button
                    onClick={() => deletejob(job._id)}
                    className="rounded bg-red-600 px-3 py-2 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Snackbar open = {toast.open} autoHideDuration={2000} onClose={closeToast}>
          <Alert onClose={closeToast} severity={toast.type} variant='filled' sx={{width:"100%"}}>
            {toast.msg}
          </Alert>
        </Snackbar>
      </Box>
    </>

}

export default Jobpage;
