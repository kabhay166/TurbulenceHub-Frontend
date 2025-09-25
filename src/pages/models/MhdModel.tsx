import {MathJax, MathJaxContext} from "better-react-mathjax";
import styles from "./HydroModel.module.css";

export default function MhdModel() {

    return <MathJaxContext>
        <div className={styles.container}>
            <h1>The Magneto-Hydrodynamics (MHD) Model</h1>

            <div className={styles.content}>

                <div className={styles.brief}>
                    <h2>Brief Description:</h2>

                    <p>
                        The magnetohydrodynamic (MHD) turbulence model extends hydrodynamic turbulence modeling to flows
                        where both fluid motion and magnetic fields interact. The governing equations are the Navier–Stokes
                        equations coupled with Maxwell&apos;s equations under the MHD approximation. In MHD turbulence,
                        energy cascades occur not only through velocity eddies but also through magnetic field fluctuations,
                        leading to complex interactions between kinetic and magnetic energies. Like in hydrodynamics,
                        direct resolution of all scales (DNS) is computationally expensive, so models such as LES or
                        RANS-based closures are employed to approximate the effects of unresolved turbulent motions
                        and magnetic field structures.
                    </p>
                </div>


                <div className={styles.governingEquations}>
                    <h2>Governing Equations:</h2>
                    <p>
                        <MagnetoHydroDynamicEquations />
                    </p>
                </div>

            </div>

        </div>
    </MathJaxContext>
}



function MagnetoHydroDynamicEquations() {
    return (
        <div>
            <p>
                Continuity equation:
                <MathJax>{"\\( \\nabla \\cdot u = 0 \\)"}</MathJax>
            </p>

            <p>
                Momentum equation:
                <MathJax>
                    {
                        "\\( \\frac{\\partial u}{\\partial t} + (u \\cdot \\nabla)u = -\\nabla p + \\nu \\nabla^2 u + (\\nabla \\times B) \\times B \\)"
                    }
                </MathJax>
            </p>

            <p>
                Induction equation:
                <MathJax>
                    {
                        "\\( \\frac{\\partial B}{\\partial t} = \\nabla \\times (u \\times B) + \\eta \\nabla^2 B \\)"
                    }
                </MathJax>
            </p>

            <p>
                Divergence-free magnetic field:
                <MathJax>{"\\( \\nabla \\cdot B = 0 \\)"}</MathJax>
            </p>
        </div>
    );
}
