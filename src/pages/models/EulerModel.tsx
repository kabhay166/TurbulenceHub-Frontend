import {MathJax, MathJaxContext} from "better-react-mathjax";
import styles from "@/pages/models/HydroModel.module.css";

export default function EulerModel() {
    return <MathJaxContext> <div className={styles.container}>
        <h1>The Euler Model</h1>

        <div className={styles.content}>
            <div className={styles.brief}>
                <h2>Brief Description:</h2>

                <p>
                    The Euler model describes the motion of an ideal, inviscid fluid governed by the Euler equations.
                    Unlike the Navier–Stokes framework, viscosity and dissipative effects are neglected, making the model
                    suitable for flows where viscous stresses are negligible compared to inertial and pressure forces.
                    It captures compressible and incompressible fluid behavior, including shock formation and large-scale
                    flow structures, but does not account for turbulence or small-scale dissipation mechanisms.
                </p>
            </div>

            <div className={styles.governingEquations}>
                <h2>Governing Equations:</h2>
                <p>
                    <EulerEquation />
                </p>
            </div>
        </div>

    </div>
    </MathJaxContext>
}

function EulerEquation() {
    return (
        <div>
            <p>
                Continuity equation:
                <MathJax>{"\\( \\nabla \\cdot u = 0 \\)"}</MathJax>
            </p>

            <p>
                Momentum equation:
                <MathJax>
                    {"\\( \\frac{\\partial u}{\\partial t} + (u \\cdot \\nabla)u = -\\nabla p \\)"}
                </MathJax>
            </p>
        </div>
    );
}
