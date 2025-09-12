import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.container}>
      <h1>Welcome To TurbulenceHub</h1>
      <div className={styles.content}>
        <p>
          We are an interdisciplinary group working in the area of Turbulence and Nonlinear Physics. Our research interests include
          Convection, Dynamo, Magnetohydrodynamic Turbulence, High-Performance Computing, Non-equilibrium Statistical Mechanics.
          The simulations conducted at our lab generate huge amount of data which typically resides in different machines in the
          form of .h5 files or .d files. This web portal has been created to help the faculty and the students to access this data.
          You can download the data you want to your PC and analyze it.
        </p>

        <p>
          The data is broadly classified into 4 categories: RBC, HYDRO, SCALAR and MHD. Within each category, there are further
          classifications based on grid-resolution, box size, initial conditions and other parameters relevant to the kind of data
          you are looking for. For example, the relevant parameter for HYDRO data is just viscosity. For MHD data, the relevant
          parameters are viscosity and magnetic diffusivity. For SCALAR and RBC datasets, the relevant parameters are viscosity,
          thermal diffusivity, rayleigh number, critical rayleigh number and prandtl number. You will be able to filter the dataset
          based on these parameters and download the dataset you need.
        </p>

        <p>
          Any kind of data typically contains time series for modal energies and flux, snapshot of the field at different times,
          energies for selected modes and time series for total energy. Click on DATA on the navigation tab above to get started.
          In some cases, you might also find entropy and enstrophy time series data. If not, you can calculate them at your end.
        </p>
      </div>
      
    </div>
  )
}
