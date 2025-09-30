import styles from './Models.module.css';
import { Link } from '@tanstack/react-router';
import { MathJaxContext } from "better-react-mathjax";
import { FaArrowRight } from "react-icons/fa";

export default function Models() {
  return (
    <MathJaxContext>
    <div className={styles.container}>
        {/*<ModelSidebar />*/}
        <ModelMain />
      </div>
      </MathJaxContext>
  )
}

type ModelType = 'Euler'|'Hydro'|'MHD'|'RBC';

const modelRouteMap: Record<ModelType, "/models/euler" | "/models/hydro" | "/models/mhd" | "/models/rbc"> = {
    Euler: "/models/euler",
    Hydro: "/models/hydro",
    MHD: "/models/mhd",
    RBC: "/models/rbc",
};

// function ModelSidebar() {
//     return <div className={styles.sidebar}>
//         <ul>
//             <li>Euler</li>
//             <li>Hydro</li>
//             <li>MHD</li>
//         </ul>
//     </div>
// }

function ModelMain() {
    return <div className={styles.main}>
        <h1>Models</h1>
        {/*<p>In our study of turbulence we deal with the following models.</p>*/}

        <div className={styles.modelsContainer}>

        <ModelItem title={'Euler'}
                   content={"The Euler model describes the dynamics of an ideal fluid where viscosity and heat conduction are neglected. It is widely used to study large-scale flow structures, compressible and incompressible flows, and shock wave phenomena without accounting for turbulence or dissipation."}
                   kind={'euler'} />

        <ModelItem
            title={'Hydro'}
            content={"The hydrodynamic turbulence model governs the motion of viscous fluids through the Navier–Stokes equations. It captures the development of vortices, eddies, and turbulent cascades, and is fundamental for studying real-world flows ranging from aerodynamics to ocean currents."}
            kind={'hydro'}
            />

            <ModelItem
                title={'MHD'}
                content={"The magnetohydrodynamic (MHD) model extends fluid dynamics by coupling the Navier–Stokes equations with Maxwell’s equations. It describes the interaction between fluid motion and magnetic fields, and is essential in astrophysics, plasma physics, and fusion research."}
                kind={'mhd'}
            />

            <ModelItem
                title={'RBC'}
                content={"The Rayleigh–Bénard convection (RBC) model explains buoyancy-driven flows in a fluid layer heated from below and cooled from above. It is a canonical system for studying convection, turbulence, and pattern formation in geophysical and astrophysical environments."}
                kind={'rbc'}
            />

        </div>
    </div>
}


function ModelItem({title,content,kind} : {title:ModelType, content: string,kind:string}) {
    return <div className={styles.modelItem}>
        <h2>{title}</h2>
        <div>
            <p>
                {content}
            </p>

            <div className={styles.buttonContainer}>

                <button>
                    <Link to={modelRouteMap[`${title}`]}>Learn More <FaArrowRight /></Link>
                </button>
                <button>
                    <Link to='/demo/$kind' params={{kind:kind}}>Try this model <FaArrowRight /></Link>
                </button>

            </div>

        </div>

    </div>
}

