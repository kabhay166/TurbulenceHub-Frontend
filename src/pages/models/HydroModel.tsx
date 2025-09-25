import styles  from "./HydroModel.module.css";
import {MathJax, MathJaxContext} from "better-react-mathjax";

export default function HydroModel() {
    return <MathJaxContext> <div className={styles.container}>
        <h1>The Hydrodynamics (Hydro) Model</h1>

        <div className={styles.content}>
            <div className={styles.brief}>
                <h2>Brief Description:</h2>

                <p>
                    The hydro turbulence model refers to turbulence modeling in the context of incompressible or weakly compressible fluid flows governed by the Navier–Stokes equations.
                    In hydrodynamics (as opposed to magnetohydrodynamics), turbulence arises from nonlinear interactions between eddies at different scales. Since resolving all scales directly (DNS) is computationally prohibitive at high Reynolds numbers, turbulence models are used.
                </p>
            </div>

            <div className={styles.governingEquations}>
                <h2>Governing Equations:</h2>
                <p>
                    <HydroDynamicEquation />
                </p>
            </div>
        </div>

    </div>
    </MathJaxContext>
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