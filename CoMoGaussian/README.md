<p align="center">
<h1 align="center"><img src="./cream_rect.png" align="top" width="38" height="38" />&nbsp;CRiM-GS: Continuous Rigid Motion-Aware Gaussian Splatting from Motion Blur Images</h1>
  <p align="center">
    <a href="https://Jho-Yonsei.github.io/">Jungho Lee</a>
    ·
    <a href="https://scholar.google.com/citations?user=BaFYtwgAAAAJ&hl=ko">Donghyeong Kim</a>
    ·
    <a href="https://dogyoonlee.github.io/">Dogyoon Lee</a>
    ·
    <a href="https://suhwan-cho.github.io/">Suhwan Cho</a>
    ·
    <a href="http://mvp.yonsei.ac.kr/">Sangyoun Lee</a>
  </p>
  <h3 align="center"><a href="https://arxiv.org/pdf/2407.03923">📄 Paper</a> | <a href="https://Jho-Yonsei.github.io/CRiM-Gaussian">🌐 Project Page</a></h3>
  <div align="center"></div>
</p>
<br/>
<p align="center">
  <img width="51%" alt="WildGaussians model appearance" src=".assets/cover-trevi.webp" />
  <img width="43%" alt="WildGaussians remove occluders" src=".assets/cover-onthego.webp" />
</p>
<p align="justify">
We introduce WildGaussians, a novel approach to handle occlusions and appearance changes with 3DGS.
By leveraging robust DINO features and integrating an appearance modeling module within 3DGS, our method achieves state-of-the-art results.
We demonstrate that WildGaussians matches the real-time rendering speed of 3DGS while surpassing both 3DGS and NeRF baselines in handling in-the-wild data, all within a simple architectural framework.
</p>
<br>

# CRiM-GS: Continuous Rigid Motion-Aware Gaussian Splatting from Motion Blur Images

<p align="center" width="100%">
    <img width="33%" src="./cream_cut.png">
</p>

--------
<p align="center">
	<a href="https://yanyan-li.github.io/project/gs/geogaussian.html"><img src="https://img.shields.io/badge/GeoGaussian-ProjectPage-green.svg"></a>
     <a href="http://arxiv.org/abs/2403.11324"><img src="https://img.shields.io/badge/GeoGaussian-Paper-yellow.svg"></a>
    <a href="https://"><img src="https://img.shields.io/badge/GeoGaussian-video-blue.svg"></a>
</p>

<p align="center" width="100%">
    <video src="https://github.com/yanyan-li/GeoGaussian/blob/main/img/teaser_challenging.mp4"></video>
</p>

| 3DGS    | LightGS | GeoGaussian |
| :------: | :------: | :------:
| <img width="100%" src="./img/gif/o2-3DGS.gif">  |  <img width="100%" src="./img/gif/o2-light.gif">   |<img width="100%" src="./img/gif/o2-ours.gif">|

### BibTex
```
@article{li2024geogaussian,
  title={GeoGaussian: Geometry-aware Gaussian Splatting for Scene Rendering},
  author={Li, Yanyan and Lyu, Chenyu and Di, Yan and Zhai, Guangyao and Lee, Gim Hee and Tombari, Federico},
  journal={arXiv preprint arXiv:2403.11324},
  year={2024}
}
```


### 1.Dataset
Based on the SLAM method, **PlanarSLAM**, we create new point clouds rather then using results of COLMAP for experiments. 

<p align="center" width="100%">
    <img width="90%" src="./img/dataset_img.png">
</p>

**New Features of this type of input**
<ol>
<li> Points lying on the non-textured regions </li>
<li> Global plane instances that are represented in different colors </li>
<li> Surface normal vector of each planar point </li>
</ol>

**The subdataset can be obtained via [Replica (PlanarSLAM)](https://drive.google.com/drive/folders/1LO0a-M__cZJu3TnaMX-fEP4YxFs5LDGZ?usp=drive_link), [TUM RGB-D (PlanarSLAM)](https://drive.google.com/drive/folders/1hDPRH3FGg_HpQYwZWg_wgZbonClVbcbC?usp=drive_link), [ICL NUIM (PlanarSLAM)](https://drive.google.com/drive/folders/1UV7DqybCUcYl3Yn4kV030lQOKhwGUHU6?usp=drive_link). Then you need to place the raw dataset images in the ``results`` folder. The raw images can be obtained via [Replica](https://cvg-data.inf.ethz.ch/nice-slam/data/Replica.zip), [TUM RGB-D](https://cvg.cit.tum.de/data/datasets/rgbd-dataset/download), [ICL NUIM](https://www.doc.ic.ac.uk/~ahanda/VaFRIC/iclnuim.html).**

**For each sequence, the structure is organized as follows**
```
Replica_r2
	|______PointClouds.ply   # sparse point clouds from the SLAM system
 	|______KeyFrameTrajectory2.txt  # camera poses from the SLAM system
  	|______results     # folder for all raw images
```
*our code provides the interface to deal with the type of data format.*


### 2.Baseline
**1. Gaussian-Splatting with Planar Point Clouds**
[Repo](https://github.com/yanyan-li/gaussian-splatting-using-PlanarSLAM?tab=readme-ov-file)




### Setup of GeoGaussian
The code will be released soon!