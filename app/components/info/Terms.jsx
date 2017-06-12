const Base = require('../Base');
const React = require('react');
const Paper = require('material-ui/Paper').default;
const Markdown = require('../common/Markdown');

const markdown =
`# Introduction

These terms and conditions govern your use of this website; by using this website, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website. 

# License to use website

Unless otherwise stated, Plaaant and/or its licensors and/or its contributors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved.

You may view, download for caching purposes only, and print pages from the website for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.  

You must not:

* Republish material from this website (including republication on another website);
* Sell, rent or sub-license material from the website;
* Show any material from the website in public;
* Reproduce, duplicate, copy or otherwise exploit material on this website for a commercial purpose;
* Edit or otherwise modify any material on the website unless it is "your user content";
* Redistribute material from this website.

# Acceptable use

You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.

You must not use this website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.

You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to this website without Plaaant's express written consent.

You must not use this website to transmit or send unsolicited commercial communications.

You must not use this website for any purposes related to marketing without Plaaant's express written consent.

# User content

In these terms and conditions, “your user content” means material (including without limitation text, images, audio material, video material and audio-visual material) that you submit to this website, for whatever purpose.

You grant to Plaaant a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your user content in any existing or future media.  You also grant to Plaaant the right to sub-license these rights, and the right to bring an action for infringement of these rights.

Your user content must not be illegal or unlawful, must not infringe any third party's legal rights, and must not be capable of giving rise to legal action whether against you or Plaaant or a third party (in each case under any applicable law).  

You must not submit any user content to the website that is or has ever been the subject of any threatened or actual legal proceedings or other similar complaint.

Plaaant reserves the right to edit or remove any material submitted to this website, or stored on Plaaant's servers, or hosted or published upon this website.

Notwithstanding Plaaant's rights under these terms and conditions in relation to user content, Plaaant does not undertake to monitor the submission of such content to, or the publication of such content on, this website.

# No warranties

This website is provided “as is” without any representations or warranties, express or implied.  Plaaant makes no representations or warranties in relation to this website or the information and materials provided on this website.  

Without prejudice to the generality of the foregoing paragraph, Plaaant does not warrant that:

* this website will be constantly available, or available at all; or
* the information on this website is complete, true, accurate or non-misleading.

Nothing on this website constitutes, or is meant to constitute, advice of any kind. If you require advice in relation to any legal, financial or medical matter you should consult an appropriate professional.

# Limitations of liability

Plaaant will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website:

* to the extent that the website is provided free-of-charge, for any direct loss;
* for any indirect, special or consequential loss; or
* for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data.

These limitations of liability apply even if Plaaant has been expressly advised of the potential loss.

# Exceptions

Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit; and nothing in this website disclaimer will exclude or limit Plaaant's liability in respect of any:

* death or personal injury caused by Plaaant's negligence;
* fraud or fraudulent misrepresentation on the part of Plaaant; or
* matter which it would be illegal or unlawful for Plaaant to exclude or limit, or to attempt or purport to exclude or limit, its liability. 

# Reasonableness

By using this website, you agree that the exclusions and limitations of liability set out in this website disclaimer are reasonable.  

If you do not think they are reasonable, you must not use this website.

# Other parties

You accept that, as a limited liability entity, Plaaant has an interest in limiting the personal liability of its officers and employees.  You agree that you will not bring any claim personally against Plaaant's officers or employees in respect of any losses you suffer in connection with the website.

Without prejudice to the foregoing paragraph, you agree that the limitations of warranties and liability set out in this website disclaimer will protect Plaaant's officers, employees, agents, subsidiaries, successors, assigns and sub-contractors as well as Plaaant. 

# Unenforceable provisions

If any provision of this website disclaimer is, or is found to be, unenforceable under applicable law, that will not affect the enforceability of the other provisions of this website disclaimer.

# Indemnity

You hereby indemnify Plaaant and undertake to keep Plaaant indemnified against any losses, damages, costs, liabilities and expenses (including without limitation legal expenses and any amounts paid by Plaaant to a third party in settlement of a claim or dispute on the advice of Plaaant's legal advisers) incurred or suffered by Plaaant arising out of any breach by you of any provision of these terms and conditions, or arising out of any claim that you have breached any provision of these terms and conditions.

# Breaches of these terms and conditions

Without prejudice to Plaaant's other rights under these terms and conditions, if you breach these terms and conditions in any way, Plaaant may take such action as Plaaant deems appropriate to deal with the breach, including suspending your access to the website, prohibiting you from accessing the website, blocking computers using your IP address from accessing the website, contacting your internet service provider to request that they block your access to the website and/or bringing court proceedings against you.

# Variation

Plaaant may revise these terms and conditions from time-to-time.  Revised terms and conditions will apply to the use of this website from the date of the publication of the revised terms and conditions on this website.  Please check this page regularly to ensure you are familiar with the current version.

# Assignment

Plaaant may transfer, sub-contract or otherwise deal with Plaaant's rights and/or obligations under these terms and conditions without notifying you or obtaining your consent.

You may not transfer, sub-contract or otherwise deal with your rights and/or obligations under these terms and conditions.  

# Severability

If a provision of these terms and conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect.  If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect. 

# Entire agreement

These terms and conditions constitute the entire agreement between you and Plaaant in relation to your use of this website, and supersede all previous agreements in respect of your use of this website.

# Law and jurisdiction

These terms and conditions will be governed by and construed in accordance with United States Law, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Arizona.
`;

class Terms extends React.Component {
  render() {
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block',
    };

    return (
      <Base>
        <Paper style={paperStyle} zDepth={5}>
          <Markdown markdown={markdown} />
        </Paper>
      </Base>
    );
  }
}

module.exports = Terms;
