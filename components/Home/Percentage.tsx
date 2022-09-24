import { type Nonprofit } from "../../lib/change";
import Grid from '../Grid'
import { Select } from "../Input";

export default function ({
    onSubmit,
    onChangePercent,
    popular,
    percent
}: {
    onChangePercent: JSX.IntrinsicElements['select']['onChange'],
    onSubmit: JSX.IntrinsicElements['form']['onSubmit'],
    popular: Nonprofit[],
    percent: string
}) {
    return (
        <>
            <Grid className="mb-7">
                <div className="lg:col-span-7">
                    <h1 className="text-4xl leading-tight font-bold">
                        Donate&nbsp;
                        <Select name="percent" value={percent} onChange={onChangePercent}>
                            <option value="33">33%</option>
                            <option value="25">25%</option>
                            <option value="20">20%</option>
                            <option value="15">15%</option>
                            <option value="10">10%</option>
                            <option value="5">5%</option>
                            <option value="3">3%</option>
                            <option value="2">2%</option>
                            <option value="1">1%</option>
                        </Select>%
                        of your checking account to charity every year.
                    </h1>
                    {/* <p class="text-xl mt-5 text-dim">Donated in monthly increments. Cancelable anytime.</p> */}
                </div>
            </Grid>
        </>
    )
}