import styles from './Models.module.css';
import { Link } from '@tanstack/react-router';
import { MathJaxContext } from "better-react-mathjax";
import { MathJax } from "better-react-mathjax";
import { FaArrowRight } from "react-icons/fa";

export default function Models() {
  return (
    <MathJaxContext>
    <div className={styles.container}>
      <h1>Models</h1>
      <p>In our study of turbulence we deal with the following models.</p>
      
      <div className={styles.modelContainer}>
        <h2>Hydro</h2>
        <p>
          A hydrodynamic model of turbulence refers to the mathematical description
          of turbulent fluid motion using the governing equations of fluid dynamics.
        </p>
        <HydroDynamicEquation />

        <button>
        <Link to='/demo/$kind' params={{kind:'hydro'}}>Try this model <FaArrowRight /></Link>
        </button>
      </div>

      <div className={styles.modelContainer}>
        <h2>MHD</h2>
        <p>
          This is the magneto-hydrodynamic model.
        </p>
        <button>
            <Link to='/demo/$kind' params={{kind:'mhd'}}>Try this model <FaArrowRight /></Link>
        </button>
      </div>
      
      </div>
      </MathJaxContext>
  )
}

function HydroDynamicEquation() {
  return (
    <div>
      <p>
        Continuity equation:
        <MathJax>{"\\( \\nabla \\cdot u = 0 \\)"}</MathJax>
      </p>

      <p>
        Momentum equation:
        <MathJax>
          {"\\( \\frac{\\partial u}{\\partial t} + (u \\cdot \\nabla)u = -\\nabla p + \\nu \\nabla^2 u \\)"}
        </MathJax>
      </p>
    </div>
  );
}
